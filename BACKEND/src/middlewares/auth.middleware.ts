import type { Request, Response, NextFunction } from "express";
import { success } from "zod";
import jwt, { type JwtPayload } from "jsonwebtoken";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log(token)
  const SECRET = process.env.SECRET || "";
  try {
    const decoded = jwt.verify(token, process.env.SECRET!) as JwtPayload;

    console.log(decoded)
    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
