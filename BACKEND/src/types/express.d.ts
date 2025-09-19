import * as e from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            file?: Express.Multer.File;
      files?: Express.Multer.File[];
        }
    }
}
