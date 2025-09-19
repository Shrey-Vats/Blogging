import type { Request, Response } from "express";
import { signUpSchema, signInSchema } from "../schemas/auth.schema";
import z, { success } from "zod";
import prisma from "../utils/db";
import bcrypt from "bcryptjs";
import type { ApiResponse } from "../types/ApiResponse";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

export const signUp = async (req: Request<{},{}, z.infer<typeof signUpSchema>>, res: Response<ApiResponse>) => {
    try {
        const {email, name, password} = req.body;

    // zode validation
    const result = signUpSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message: result.error.issues[0]?.message!,
            success: false
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(user){
        return res.status(400).json({
            message: "User already exit in db",
            success: false
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
        data: {
            email, 
            password: hashPassword,
            name,

            createdAt: new Date()
        }
    })

    return res.status(201).json({
        message: "User created successfuly",
        success: true,
        data: createdUser
    })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        })        
    }
}
export const signIn = async (req: Request<{},{},z.infer<typeof signInSchema>>, res: Response<ApiResponse>) => {
   try {
     const {email, password} = req.body

    const SECRET = process.env.SECRET || ""

    const result = signInSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message: result.error.issues[0]?.message!,
            success: false
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        return res.status(400).json({
            message: "user not found",
            success: false
        })
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if(!comparePassword){
        return res.status(400).json({
            message: "Incorrect password",
            success: false
        })
    }

    const token = jwt.sign({
        id: user.id,
    }, SECRET)

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
});  

    res.status(200).json({
        message: "User login successfuly",
        success: true,
        data: res.cookie
    });
   } catch (error) {
    console.error(error);
    res.status(500).json({
        message: "Internal server error",
        success: false
    })
   }
}

export const logOut = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token")
    } catch (error) {
        console.error(error);
    res.status(500).json({
        message: "Internal server error",
        success: false
    })
    }
}