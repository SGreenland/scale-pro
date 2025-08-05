import { Request, Response } from "express";
import { Settings } from "@shared/types";
import {
    getUserSettings,
    updateUserSettings,
} from "../services/userSettingsService";
import { SettingsRequestBody } from "../types";
import { validateToken } from "../validators/helpers/auth";

export async function get(req: Request, res: Response): Promise<Response> {
  const userId = req.params.id as string;

  const token = req.headers.authorization?.split(" ")[1];

  if (!token || !validateToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userSettings = await getUserSettings(userId);

  if (userSettings === null) {
    return res.status(404).json({ error: "Settings not found" });
  }

  return res.status(200).json({
    settings: userSettings,
  });
}

export async function post(req: Request, res: Response): Promise<Response> {
  const userId = req.params.id as string;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { settings } = req.body as SettingsRequestBody;

  if (!settings) {
    return res.status(400).json({ error: "Settings are required" });
  }

  try {
    const updatedSettings = await updateUserSettings(userId, settings);
    return res
      .status(200)
      .json({ settings: updatedSettings as unknown as Settings });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
