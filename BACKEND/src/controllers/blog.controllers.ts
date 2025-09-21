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
    const userId = req.userId!;

    const result = createBlogSchema.safeParse(req.body);
    if (!result.success) {
      return next({
        status: 400,
        message: result.error.issues[0]?.message || "Invalid input data",
        errors: result.error.issues
      });
    }

    const { title, content, image } = result.data;

    // Generate slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, "-")     // Replace spaces with hyphens
      .replace(/-+/g, "-")      // Replace multiple hyphens with single
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const createdBlog = await prisma.blog.create({
      data: {
        content,
        image: image,
        slug,
        title,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: createdBlog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const updateBlog = async (
  req: Request<{ id: string }, {}, Partial<z.infer<typeof createBlogSchema>>>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;
    const userId = req.userId!;

    if (!id) {
      return next({
        status: 400,
        message: "Blog ID is required",
      });
    }

    const result = createBlogSchema.partial().safeParse(req.body);

    if (!result.success) {
      return next({
        status: 400,
        message: result.error.issues[0]?.message!,
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return next({
        status: 404,
        message: "No blog found with this id",
      });
    }

    if (userId !== blog.userId) {
      return next({
        status: 403,
        message: "You are not authorized to update this blog",
      });
    }

    let data: Partial<blog & { slug: string }> = {};

    if (title && title.trim() !== "") {
      data.title = title.trim();
      // Generate new slug if title changes
      const baseSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug (excluding current blog)
      while (await prisma.blog.findFirst({ 
        where: { 
          slug,
          NOT: { id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      data.slug = slug;
    }
    if (content && content.trim() !== "") data.content = content.trim();
    if (image && image.trim() !== "") data.image = image.trim();

    const updated = await prisma.blog.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      message: "Blog updated successfully",
      success: true,
      data: updated
    });
  } catch (error) {
    console.error("Update blog error:", error);
    next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const getBlog = async (
  req: Request<{ slug: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return next({
        status: 400,
        message: "Blog slug is required",
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      return next({
        status: 404,
        message: "No blog found with this slug",
      });
    }

    return res.status(200).json({
      message: "Blog fetched successfully",
      success: true,
      data: blog
    });
  } catch (error) {
    console.error("Get blog error:", error);
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

    if (!userId) {
      return next({
        status: 401,
        message: "Unauthorized",
      });
    }

    const blogs = await prisma.blog.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Don't include full content for list view
        content: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      message: "Blogs fetched successfully",
      success: true,
      data: blogs,
    });

  } catch (error) {
    console.error("Get user blogs error:", error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.blog.count(),
    ]);

    return res.status(200).json({
      message: "All blogs fetched successfully",
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    console.error("Get all blogs error:", error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const deleteBlog = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    if (!id) {
      return next({
        status: 400,
        message: "Blog ID is required",
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return next({
        status: 404,
        message: "No blog found with this id",
      });
    }

    if (userId !== blog.userId) {
      return next({
        status: 403,
        message: "You are not authorized to delete this blog",
      });
    }

    await prisma.blog.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Blog deleted successfully",
      success: true,
      data: null,
    });

  } catch (error) {
    console.error("Delete blog error:", error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};