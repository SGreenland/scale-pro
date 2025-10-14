import { Request, Response } from "express";
import { prisma } from "../prisma";
import { checkPremiumAccess } from "../validators/helpers/auth";
import jwt from "jsonwebtoken";

export async function get(req: Request, res: Response) {
  const notePatterns = await prisma.notePattern.findMany({
    orderBy: { id: "asc" },
  });

  const token = req.cookies?.token;
  // not logged in, return only free patterns
  if (!token) {
    return res
      .status(200)
      .json({ notePatterns: notePatterns.filter((np) => !np.isPremium) });
  }

  // decode token from cookie
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: string;
    userName: string;
  };

  req.user = {
    id: decoded.userId,
    userName: decoded.userName,
  };

  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    include: { subscription: true, unlockedPatterns: true },d
  });

  // invalid user, or no premium access, return only free patterns
  if (!user || !checkPremiumAccess(user)) {
    return res
      .status(200)
      .json({ notePatterns: notePatterns.filter((np) => !np.isPremium) });
  }

  // return all patterns and unlocked pattern ids
  return res
    .status(200)
    .json({
      notePatterns: notePatterns,
      unlockedPatterns: user.unlockedPatterns.map((p) => p.notePatternId),
    });
}

export async function unlock(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { subscription: true, unlockedPatterns: true },
  });
  if (!user || !checkPremiumAccess(user)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { patternId } = req.body;
  const pattern = await prisma.notePattern.findUnique({
    where: { id: patternId },
  });
  if (!pattern) {
    return res.status(400).json({ message: "Invalid pattern" });
  }
  // insert into unlockedPatterns if not already unlocked
  const alreadyUnlocked = user.unlockedPatterns.find(
    (p) => p.notePatternId === patternId
  );
  if (!alreadyUnlocked) {
    await prisma.userUnlockedPattern.create({
      data: {
        userId: user.id,
        notePatternId: patternId,
      },
    });
  }
  return res.status(200).json({ message: "Pattern unlocked" });
}
