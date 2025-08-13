import { prisma } from "../prisma";
import bcrypt from "bcryptjs";


export async function updateUserProfile(userId: string, email: string, userName: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
});
  if (!user) {
    throw new Error("User not found");
  }


  // Assuming profile is an object with user profile data
  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data: {
        email: email,
        userName: userName
    },
  });

  return updatedProfile;
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the current password matches
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return updatedUser;
}