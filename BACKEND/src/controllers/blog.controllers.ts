import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import type z from "zod";
import { createBlogSchema } from "../schemas/blog.schema";
import type { ApiResponse } from "../types/ApiResponse";
import prisma from "../utils/db";
import type { blog } from "../types/blog.type";

export const createBlog = async (
  req: Request<{}, {}, z.infer<typeof createBlogSchema>>,
  res: Response
) => {
  try {
    const { title, content, image } = req.body;
    const userId = req.userId!;
    const result = createBlogSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues,
        success: false,
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
      return res.status(400).json({
        message: "Blog with given title already exit",
        success: false,
      });
    }

    console.log(   content,
        image,
        slug,
        title,
        userId,)

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
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateBlog = async (
  req: Request<{}, {}, z.infer<typeof createBlogSchema>>,
  res: Response<ApiResponse>
) => {
  try {
    const { title, content, image, id } = req.body;
    const userId = req.userId!;
    const result = createBlogSchema.partial().safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message!,
        success: false,
      });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });

    if (!blog) {
      return res.status(400).json({
        message: "There is No longer blog with given info",
        success: false,
      });
    }

    if (userId !== blog.userId) {
      return res.status(401).json({
        message: "You are unauthorize",
        success: false,
      });
    }

    let data: Partial<blog> = {};
    if (title !== "" && title !== undefined) data.title = title;
    if (content !== "" || content !== undefined) data.content = content;
    if (image !== "" || image !== undefined) data.image = image;

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
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getBlog = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const blogId = req.params.id;

    const user = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        title: true,
        content: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "No blog found with this id",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Content send successfuly",
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllBlogPostOfMyself = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "Invalid userId Id",
        success: false,
      });
    }

    const blog = await prisma.blog.findMany({
      where: {
        userId,
      },
    });

    console.log(blog)

    if (!blog) {
      return res.status(404).json({
        message: "No blog found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Blog post has been send",
      success: true,
      data: blog,
    });

  } catch (error) {
    
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
