import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type z from "zod";
import { createBlogSchema } from "../schemas/blog.schema";
import type { ApiResponse } from "../types/ApiResponse";
import prisma from "../utils/db";
import type { blog } from "../types/blog.type";

export const createBlog = async (
  req: Request<{}, {}, z.infer<typeof createBlogSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, image } = req.body;
    const userId = req.userId!;
    const result = createBlogSchema.safeParse(req.body);

    if (!result.success) {
      return next({
    status:400,
        message: result.error.issues[0]?.message!,
      });
    }

    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (blog) {
      return next({
    status:400,
        message: "Blog with given title already exit",
      });
    }

    const createdBlog = await prisma.blog.create({
      data: {
        content,
        image,
        slug,
        title,
        userId,
      },
    });

    res.status(201).json({
      message: "Blog created successfuly",
      success: true,
      data: createdBlog,
    });
  } catch (error) {
    return next({
    status: 500,
      message: "Internal server error",
    })
  }
};

export const updateBlog = async (
  req: Request<{}, {}, z.infer<typeof createBlogSchema>>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { title, content, image, id } = req.body;
    const userId = req.userId!;
    const result = createBlogSchema.partial().safeParse(req.body);

    if (!result.success) {
      return next({
    status:400,
        message: result.error.issues[0]?.message!,
      });
    }

     const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });

    if (!blog) {
      return next({
    status:404,
        message: "No blog found with this id",
      });
    }

    if (userId !== blog.userId) {
      return next({
    status:403,
        message: "You are not authorized to update this blog",
      });
    }

    let data: Partial<blog> = {};

    if (title !== "" && title !== undefined) {
      data.title = title
      data.slug = slug
    };
    if (content !== "" && content !== undefined) data.content = content;
    if (image !== "" &&  image !== undefined) data.image = image;

    const updated = await prisma.blog.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      message: "User blog updated successfuly",
      success: true,
      data: updated
    })
  } catch (error) {
    next({
    status: 500,
      message: "Internal server error",
    });
  }
};

export const getBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const slug = req.params.id;

    const user = await prisma.blog.findUnique({
      where: {
        slug
      },
      select: {
        title: true,
        content: true,
        image: true,
      },
    });

    if (!user) {
      return next({
      status: 404,
        message: "No blog found with this id",
      });
    }

    return res.status(200).json({
      message: "Content send successfuly",
      success: true,
      data: user
    });
  } catch (error) {
    return next({
    status: 500,
      message: "Internal server error",
    });
  }
};

export const getAllBlogPostOfMyself = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    console.log(userId)
    if (!userId) {
      return next({
    status:401,
        message: "Unauthorized",
      });
    }

    const blog = await prisma.blog.findMany({
      where: {
        userId,
      },
    });

    console.log(blog)

    if (!blog) {
      return next({
    status:404,
        message: "No blog found",
      })
    }

    return res.status(200).json({
      message: "Blog post has been send",
      success: true,
      data: blog,
    });

  } catch (error) {
    return next({
    status: 500,
      message: "Internal server error",
    })
  }
};
