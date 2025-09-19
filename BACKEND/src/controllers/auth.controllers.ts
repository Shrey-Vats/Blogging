import type { NextFunction, Request, Response } from "express";
import { signUpSchema, signInSchema } from "../schemas/auth.schema";
import z, { success } from "zod";
import prisma from "../utils/db";
import bcrypt from "bcryptjs";
import type { ApiResponse } from "../types/ApiResponse";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const signUp = async (
  req: Request<{}, {}, z.infer<typeof signUpSchema>>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { email, name, password } = req.body;

    // zode validation
    const result = signUpSchema.safeParse(req.body);
    if (!result.success) {
      return next({
        status: 400,
        message: result.error.issues[0]?.message!,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return next({
        status: 400,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,

        createdAt: new Date(),
      },
    });

    return res.status(201).json({
      message: "User created successfuly",
      success: true,
      data: createdUser,
    });
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};
export const signIn = async (
  req: Request<{}, {}, z.infer<typeof signInSchema>>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const SECRET = process.env.SECRET || "";

    const result = signInSchema.safeParse(req.body);
    if (!result.success) {
      return next({
        status: 400, message: result.error.issues[0]?.message!,
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return next({
        status: 400, message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User login successfuly",
      success: true,
      data: res.cookie,
    });
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};
