// src/services/authService.ts
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginErrors } from "../types";


export async function registerUser(userName: string, email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { userName, email, password: hashedPassword },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  const errors: LoginErrors = {};
  if (!user) {
    errors.email = 'Invalid email';
    throw new Error(JSON.stringify(errors));
  }
  const isPasswordValid = await bcrypt.compare(password, user!.password);
  if (!isPasswordValid) {
    errors.password = "Invalid password";
    throw new Error(JSON.stringify(errors));
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { user, token };
}



