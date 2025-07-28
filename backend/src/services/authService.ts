// src/services/authService.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function registerUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { user, token };
}
