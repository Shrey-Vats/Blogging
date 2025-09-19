import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err:any, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        message,
        success: false,

        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    })
}