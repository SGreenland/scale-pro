import { Settings } from "@scalemaestro/shared-types";
import { JsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import { checkPremiumAccess } from "../validators/helpers/auth";

export async function getUserSettings(userId: string): Promise<JsonValue | null> {
  const userSettings = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      settings: true,
    },
  });

  if (!userSettings) {
    return null;
  }
  return userSettings.settings;
}

export async function updateUserSettings(
  userId: string,
  settings: Settings
): Promise<JsonValue> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!settings) {
    throw new Error("Settings are required");
  }
  const settingsJson: JsonValue = JSON.parse(JSON.stringify(settings));
  if (settingsJson === null) {
    throw new Error("Settings cannot be null");
  }
  const user = await prisma.user.findUnique({ where: { id: userId },
    include: { subscription: true },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if(!checkPremiumAccess(user)) throw new Error("User does not have premium access");
  const updatedSettings = await prisma.user.update({
    where: { id: userId },
    data: { settings: settingsJson as any },
    select: { settings: true },
  });

  return updatedSettings.settings;
}
