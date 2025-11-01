// src/controllers/authController.ts
import { Request, Response } from "express";
import {
  getUserSessionFields,
  loginUser,
  registerUser,
  createUserToken,
  resetUserPassword,
} from "../services/authService";
import { SignupRequestBody} from "../types";
import { checkPremiumAccess, validateToken } from "../validators/helpers/auth";
import { validateSignupRequest } from "../validators/register";
import { prisma } from "../prisma";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/emailService";

export async function signup(req: Request<SignupRequestBody>, res: Response) {
  const errors = validateSignupRequest(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors: errors });
  }

  const { userName, email, password } = req.body as SignupRequestBody;

  try {
    const { user, token } = await registerUser(userName, email, password);
    return res.status(201).json({
      token,
      user: user,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const { user, token, hasPremiumAccess } = await loginUser(email, password);
    if(user.verifiedAt === null) {
      return res.status(200).json({ message: "Email not verified", verified: false });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      user: {
        userName: user.userName,
        email: user.email,
        trialExpiresAt: !user.subscription && user.trialExpiresAt,
        subscriptionId: user.subscription ? user.subscription.id : null,
        settings: user.settings || null,
      },
      hasPremiumAccess: hasPremiumAccess,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function checkTokenAndGetUser(req: Request, res: Response) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const userId = validateToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userSessionFields = await getUserSessionFields(userId);

    if (!userSessionFields) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userWithAccess = {
      ...userSessionFields,
      hasPremiumAccess: checkPremiumAccess(userSessionFields),
    };
    return res.status(200).json({ user: userWithAccess });
  } catch (err: any) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function markUserEmailAsVerified(req: Request, res: Response) {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  try {
    const userId = validateToken(token);
    if (!userId) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { verifiedAt: new Date() },
      include: { subscription: true },
    });
    //set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ user: user, message: "Email verified successfully" });
  }
  catch (err: any) {
    return res.status(400).json({ error: "Invalid token" });
  }
}

export async function resendVerificationEmail(req: Request, res: Response) {
  const email = req.body.email as string;
  if (!email) {
    return res.status(400).json({ error: "No email provided" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user.verifiedAt) {
      return res.status(400).json({ error: "Email already verified" });
    }
    const token = createUserToken(user, 15 * 60); // 15 minutes expiry
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await sendVerificationEmail(user.email, url);
    return res.status(200).json({ message: "Verification email resent successfully" });
  }
  catch (err: any) {
    return res.status(500).json({ error: "Failed to resend verification email" });
  }
}

export async function resetPasswordEmail(req: Request, res: Response) {
  const email = req.body.email as string;
  if (!email) {
    return res.status(400).json({ error: "No email provided" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const token = createUserToken(user, 15 * 60); // 15 minutes expiry
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    // Send password reset email
    await sendResetPasswordEmail(user.email, url);
    return res.status(200).json({ message: "Password reset email sent successfully" });
  }
  catch (err: any) {
    return res.status(500).json({ error: "Failed to send password reset email" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const userId = req.user?.id;
  const newPassword = req.body.newPassword as string;
  if (!newPassword) {
    return res.status(400).json({ error: "No new password provided" });
  }
  try {
    await resetUserPassword(userId!, newPassword);
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to reset password" });
  }
}
