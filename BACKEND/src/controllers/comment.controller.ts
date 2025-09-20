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
        message: "Unauthorize",
        status: 404,
      });
    }

    const { title, decription, rating, blogSlug } = req.body;

    const result = addReviewSchema.safeParse(req.body);

    if (!result.success) {
      return next({
        message: result.error.issues[0]?.message,
        status: 400,
      });
    }

    const isBlogExits = await prisma.blog.findUnique({
      where: {
        slug: blogSlug,
      },
    });

    if (!isBlogExits) {
      return next({
        message: "Blog no longer exits",
        status: 404,
      });
    }

    const isAlreadyReviewAdded = await prisma.comment.findFirst({
      where: {
        userId,
        blogId: isBlogExits.id,
      },
    });

    if (isAlreadyReviewAdded) {
      return next({
        message: "You already do commit in following blog",
        status: 400,
      });
    }

    const review = await prisma.comment.create({
      data: {
        title,
        decription,
        rating,
        blogId: isBlogExits.id,
        userId,
      },
    });

    res.status(201).json({
      message: "User have been created",
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
        message: "Unauthorize",
        status: 404,
      });
    }

    const { title, decription, rating, blogSlug } = req.body;

    const result = addReviewSchema.partial().safeParse(req.body);

    if (!result.success) {
      return next({
        message: result.error.issues[0]?.message,
        status: 400,
      });
    }

    const isBlogExits = await prisma.blog.findUnique({
      where: {
        slug: blogSlug,
      },
    });

    if (!isBlogExits) {
      return next({
        message: "Blog no longer exits",
        status: 404,
      });
    }

    const isCommientExit = await prisma.comment.findFirst({
      where: {
        userId,
        blogId: isBlogExits.id,
      },
    });

    const where: Partial<comment> = {};
    if (title && title !== undefined) where.title = title;
    if (decription && decription !== undefined) where.description = decription;
    if (rating && rating !== undefined) where.rating = rating;

    const updateComment = await prisma.comment.update({
      where: {
        id: isCommientExit!.id,
      },
      data: where,
    });

    res.status(200).json({
      message: "Comment updated successfuly",
      success: true,
      data: updateComment,
    });
  } catch (error) {
    next({
      message: "Internal server error",
      status: 500,
    });
  }
}

export async function delectReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;

    const isReviewExit = await prisma.comment.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!isReviewExit) {
      return next({
        message: "Invalid oprations, Delect not exits",
        status: 404,
      });
    }

    const delectReview = await prisma.comment.delete({
      where: {
        id: isReviewExit.id,
      },
    });

    res.status(200).json({
      message: "Review has been delected successfuly",
      success: true,
      data: delectReview
    });
  } catch (error) {
    next({
        message: "Internal server error",
        status: 500
    })
  }
}

export async function getReviewsOfBlog (
  req: Request,
  res: Response,
  next: NextFunction
) {
    try {
          const {productSlug} = req.params

    if (!productSlug){
        next({
            message: "Enter a valid product Slug",
            status: 400
        })
    }

    const product = await prisma.blog.findUnique({
        where: {
            slug: productSlug
        }
    })

    if(!product){
        return next({
            message: "Product no longer exit",
            status: 400
        })
    }
    const allReviewas = await prisma.comment.findMany({
        where: {
            blogId: product.id
        }
    })

    } catch (error) {
        next({
            message: "Internal Server error",
            status: 500
        })
    }
}
