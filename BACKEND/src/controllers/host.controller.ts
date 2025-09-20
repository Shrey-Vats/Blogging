import type { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  [key: string]: any;
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return next({ 
        message: "Cloudinary credentials not configured", 
        status: 500 
      });
    }

    console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    console.log(process.env.CLOUDINARY_API_KEY)
    console.log(process.env.CLOUDINARY_API_SECRET)

    const userId = req.userId;
    if (!userId) {
      return next({ 
        message: "Unauthorized access", 
        status: 401 
      });
    }

    if (!(req as any).file) {
      return next({ 
        message: "No file uploaded", 
        status: 400 
      });
    }

    const { title, description } = req.body;
    const buffer = req.file!.buffer;

    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blogging-images",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 630, crop: "limit" },
            { quality: "auto", fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new Error("Failed to upload image to cloud storage"));
          }
          return resolve(result as CloudinaryResponse);
        }
      );
      uploadStream.end(buffer);
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        title: title || "Untitled",
        description: description || ""
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    next({ 
      message: error instanceof Error ? error.message : "Failed to upload image", 
      status: 500 
    });
  }
}
