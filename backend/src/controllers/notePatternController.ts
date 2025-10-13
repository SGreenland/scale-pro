import { Request, Response } from "express";
import { prisma } from "../prisma";
import { checkPremiumAccess } from "../validators/helpers/auth";
import jwt from "jsonwebtoken";


export async function get(req: Request, res: Response) {
    const notePatterns = await prisma.notePattern.findMany({
        orderBy: { id: 'asc' }
    });

    const token = req.cookies?.token;
    if(!token) {
      return res.status(200).json({ notePatterns: notePatterns.filter(np => !np.isPremium) });
    }

    // decode token from cookie
     const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
          ) as { userId: string; userName: string; };

          req.user = {
            id: decoded.userId,
            userName: decoded.userName,
          };

      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        include: { subscription: true, unlockedPatterns: true }
      });

      if (!user) {
        return res.status(200).json({ notePatterns: notePatterns.filter(np => !np.isPremium) });
      }

      if(!checkPremiumAccess(user)) {
        return res.status(200).json({ notePatterns: notePatterns.filter(np => !np.isPremium) });
      }
    return res.status(200).json({ notePatterns: notePatterns, unlockedPatterns: user.unlockedPatterns.map(p => p.notePatternId) });
}