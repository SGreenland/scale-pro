import { Request, Response } from "express";
import {
    updateUserPassword,
    updateUserProfile,
} from "../services/updateUserService";
import { validateEmail } from "../validators/helpers/auth";

export async function updateProfile(
  req: Request,
  res: Response
): Promise<Response> {
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { email, userName } = req.body;

  if (!email && !userName) {
    return res.status(400).json({ error: "Profile data is required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Assuming updateUserProfile is a function that updates the user's profile
    const updatedProfile = await updateUserProfile(userId, email, userName);
    return res.status(200).json({ user: updatedProfile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updatePassword(
  req: Request,
  res: Response
): Promise<Response> {
  const userId = req.params.id as string;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Current and new passwords are required" });
  }

  try {
    // Assuming updateUserPassword is a function that updates the user's password
    const result = await updateUserPassword(
      userId,
      currentPassword,
      newPassword
    );
    return res
      .status(200)
      .json({ message: "Password updated successfully", result });
  } catch (error) {
    console.error("Error updating user password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
