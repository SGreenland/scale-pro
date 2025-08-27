import { Request, Response } from "express";
import { prisma } from "../prisma";

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