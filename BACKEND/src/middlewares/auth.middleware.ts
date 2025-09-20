import type { Request, Response, NextFunction } from "express";
import { success } from "zod";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../utils/db";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const SECRET = process.env.SECRET || "";
  try {
    const decoded = jwt.verify(token!, SECRET!) as JwtPayload;

    const verify = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!verify) {
      return next({
        message: "unauthorize",
        status: 400,
      });
    }

    console.log(token);
    console.log(decoded);
    console.log(verify);

    req.userId = decoded.id;
    next();
  } catch (err) {
    return next();
  }
};
