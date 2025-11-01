// src/services/authService.ts
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginErrors, UserSessionFields, UserWithSubscription } from "../types";
import { stripe } from "../app";
import { checkPremiumAccess, validateToken } from "../validators/helpers/auth";
import { sendVerificationEmail } from "./emailService";

export async function registerUser(
  userName: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const stripeCustomer = await stripe.customers.create({
      email: email,
    });
    if (!stripeCustomer.id) {
      throw new Error("Failed to create Stripe customer");
    }
    const user = await prisma.user.create({
      data: {
        userName: userName,
        email: email,
        password: hashedPassword,
        stripeId: stripeCustomer.id,
        trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        subscription: true,
      },
    });

    const token = createUserToken(user);

    //send verification email
    await sendVerificationEmail(
      email,
      `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    );

    return { user, token };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      subscription: true,
    },
  });
  const errors: LoginErrors = {};
  if (!user) {
    errors.email = "Invalid email";
    throw new Error(JSON.stringify(errors));
  }
  const isPasswordValid = await bcrypt.compare(password, user!.password);
  if (!isPasswordValid) {
    errors.password = "Invalid password";
    throw new Error(JSON.stringify(errors));
  }
  const hasPremiumAccess = checkPremiumAccess(user);

  const token = createUserToken(user);

  return { user, token, hasPremiumAccess };
}

export function createUserToken(user: UserWithSubscription, expiry?: number): string {
  return jwt.sign(
    {
      userId: user.id,
      userName: user.userName,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: expiry || "7d",
    }
  );
}

export async function getUserSessionFields(
  userId: string
): Promise<UserSessionFields | undefined> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
      email: true,
      trialExpiresAt: true,
      subscription: {
        select: { id: true, status: true },
      },
      settings: true,
    },
  });
  if (!user) return;
  return user as UserSessionFields;
}

export async function resetUserPassword(
  userId: string,
  newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}
