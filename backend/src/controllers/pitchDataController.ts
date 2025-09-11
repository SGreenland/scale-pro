import { Request, Response } from "express";
import { prisma } from "../prisma";
import { checkPremiumAccess } from "src/validators/helpers/auth";

export async function getPitchData(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    const pitchData = await prisma.pitchData.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ pitchData });
  } catch (error) {
    console.error("Error fetching pitch data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addPitchData(req: Request, res: Response) {
  const userId = req.user!.id;
  const { scale, percentageInTune, averageDeviation, toleranceLevel } = req.body;

  if (!scale || percentageInTune === undefined || averageDeviation === undefined || !toleranceLevel) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId },
    include: { subscription: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if(!checkPremiumAccess(user)) {
    return res.status(403).json({ error: "User does not have premium access" });
  }

  try {
    const newPitchData = await prisma.pitchData.create({
      data: {
        userId,
        scale,
        percentageInTune,
        averageDeviation,
        toleranceLevel,
        createdAt: new Date(),
      },
    });

    return res.status(201).json({ pitchData: newPitchData });
  } catch (error) {
    console.error("Error adding pitch data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}