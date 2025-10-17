// src/controllers/authController.ts
import { Request, Response } from "express";
import {
  getUserSessionFields,
  loginUser,
  registerUser,
} from "../services/authService";
import { SignupRequestBody } from "../types";
import { checkPremiumAccess, validateToken } from "../validators/helpers/auth";
import { validateSignupRequest } from "../validators/register";

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
      user: { id: user.id, userName: user.userName, email: user.email },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const { user, token, hasPremiumAccess } = await loginUser(email, password);
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
        userSettings: user.settings || null,
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
