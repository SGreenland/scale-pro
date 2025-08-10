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