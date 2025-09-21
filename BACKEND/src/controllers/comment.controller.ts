import type { NextFunction, Request, Response } from "express";
import { addReviewSchema } from "../schemas/blog.schema";
import prisma from "../utils/db";
import type { comment } from "../types/blog.type";

export async function addReviewToProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return next({
        message: "Unauthorized",
        status: 401,
      });
    }

    const { title, description, rating, blogSlug } = req.body;

    const result = addReviewSchema.safeParse(req.body);

    if (!result.success) {
      return next({
        message: result.error.issues[0]?.message,
        status: 400,
      });
    }

    const isBlogExists = await prisma.blog.findUnique({
      where: {
        slug: blogSlug,
      },
    });

    if (!isBlogExists) {
      return next({
        message: "Blog no longer exists",
        status: 404,
      });
    }

    const isAlreadyReviewAdded = await prisma.comment.findFirst({
      where: {
        userId,
        blogId: isBlogExists.id,
      },
    });

    if (isAlreadyReviewAdded) {
      return next({
        message: "You already commented on this blog",
        status: 400,
      });
    }

    const review = await prisma.comment.create({
      data: {
        title,
        decription: description, // Note: matches schema field name
        rating,
        blogId: isBlogExists.id,
        userId,
      },
    });

    res.status(201).json({
      message: "Comment has been created successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    next({
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export async function updateReviewToProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return next({
        message: "Unauthorized",
        status: 401,
      });
    }

    const { title, description, rating, blogSlug } = req.body;

    const result = addReviewSchema.partial().safeParse(req.body);

    if (!result.success) {
      return next({
        message: result.error.issues[0]?.message,
        status: 400,
      });
    }

    const isBlogExists = await prisma.blog.findUnique({
      where: {
        slug: blogSlug,
      },
    });

    if (!isBlogExists) {
      return next({
        message: "Blog no longer exists",
        status: 404,
      });
    }

    const isCommentExists = await prisma.comment.findFirst({
      where: {
        userId,
        blogId: isBlogExists.id,
      },
    });

    if (!isCommentExists) {
      return next({
        message: "Comment not found",
        status: 404,
      });
    }

    const updateData: Partial<{
      title: string;
      decription: string; // Note: matches schema field name
      rating: number;
    }> = {};
    
    if (title && title !== undefined) updateData.title = title;
    if (description && description !== undefined) updateData.decription = description;
    if (rating && rating !== undefined) updateData.rating = rating;

    const updatedComment = await prisma.comment.update({
      where: {
        id: isCommentExists.id,
      },
      data: updateData,
    });

    res.status(200).json({
      message: "Comment updated successfully",
      success: true,
      data: updatedComment,
    });
  } catch (error) {
    next({
      message: "Internal server error",
      status: 500,
    });
  }
}

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;

    const isReviewExists = await prisma.comment.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!isReviewExists) {
      return next({
        message: "Review not found",
        status: 404,
      });
    }

    const deletedReview = await prisma.comment.delete({
      where: {
        id: isReviewExists.id,
      },
    });

    res.status(200).json({
      message: "Review has been deleted successfully",
      success: true,
      data: deletedReview,
    });
  } catch (error) {
    next({
      message: "Internal server error",
      status: 500,
    });
  }
}

export async function getReviewsOfBlog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { blogSlug } = req.params;

    if (!blogSlug) {
      return next({
        message: "Enter a valid blog slug",
        status: 400,
      });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        slug: blogSlug,
      },
    });

    if (!blog) {
      return next({
        message: "Blog no longer exists",
        status: 404,
      });
    }

    const allReviews = await prisma.comment.findMany({
      where: {
        blogId: blog.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      message: "Reviews fetched successfully",
      success: true,
      data: allReviews,
    });
  } catch (error) {
    next({
      message: "Internal Server error",
      status: 500,
    });
  }
}