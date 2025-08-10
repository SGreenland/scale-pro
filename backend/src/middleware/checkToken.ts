// authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; hasPremiumAccess?: boolean; };
  }
}

export function checkToken(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.token;

      if (!token) {
        if (!required) return next();
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string; hasPremiumAccess?: boolean; };

      req.user = {
        id: decoded.userId,
        hasPremiumAccess: !!decoded.hasPremiumAccess,
      };

      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
