import type { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      next({ message: "Add credinatals first", statusCode: 500 });
    }

    interface CloudinaryResponse {
      public_id: string;
      [key: string]: any;
    }
    const userId = req.userId

    if(!userId){
        return next({message: "unatorize", statusCode: 401})
    }

    if (!(req as any).file){
        return next({message: "file does not exit's", statusCode: 400})
    }

    const {title, decription} = req.body;
    const  buffer = req.file!.buffer;

    //upload
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "blogging-images",
                resource_type: "image",
            },
            (error, result) => {
                if(error) return reject(error)
                    else return resolve(result as CloudinaryResponse);
            }
        )
        uploadStream.end(buffer);
    })


  } catch (error) {
    console.error(error);
    next();
  }
}
