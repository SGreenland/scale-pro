import { Request, Response } from "express";
import { prisma } from "../prisma"; // Adjust the import based on your project structure
import {
    updateUserPassword,
    updateUserProfile,
} from "../services/updateUserService";
import { validateEmail, validatePassword } from "../validators/helpers/auth";


export async function getProfile(req: Request, res: Response): Promise<Response> {
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Assuming getUserProfile is a function that retrieves the user's profile
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }, // Include user settings if needed
    });

    if (!userWithSubscription) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user: userWithSubscription });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

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
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res
      .status(400)
      .json({ error: "All fields are required" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  //validate new password strength
  if( !validatePassword(newPassword)) {
    return res.status(400).json({ error: "Password must be at least 8 characters long and contain a number" });
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
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
}
