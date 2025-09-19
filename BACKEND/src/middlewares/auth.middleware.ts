import type { Request, Response, NextFunction } from "express";
import { success } from "zod";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../utils/db";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  const SECRET = process.env.SECRET || "";
  try {
    const decoded = jwt.verify(token, process.env.SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const verify = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!verify) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
