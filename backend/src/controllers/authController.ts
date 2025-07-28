// src/controllers/authController.ts
import { Request, Response } from "express";
import { registerUser } from "../services/authService.js";
import { AuthResponse, SignupRequestBody } from "../types.js";


export async function signup(req: Request<SignupRequestBody>, res: Response<AuthResponse>) {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const { user, token } = await registerUser(email, password);
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
