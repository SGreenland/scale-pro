// src/controllers/authController.ts
import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { SignupRequestBody } from "../types";
import { validateSignupRequest } from "../validators/register";

export async function signup(req: Request<SignupRequestBody>, res: Response) {
  const errors = validateSignupRequest(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors: errors });
  }

  const { userName, email, password } = req.body as SignupRequestBody;

  try {
    const { user, token } = await registerUser(userName, email, password);
    return res
      .status(201)
      .json({
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
    const { user, token } = await loginUser(email, password);
    return res
      .status(200)
      .json({
        token,
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          trialExpiresAt: !user.subscription && user.trialExpiresAt,
        },
      });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
