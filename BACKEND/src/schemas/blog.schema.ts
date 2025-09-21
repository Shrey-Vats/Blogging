import z from "zod";

export const createBlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(200, "Title must be less than 200 characters"),
    content: z.string().min(20, "Content must be at least 20 characters long").max(50000, "Content must be less than 50,000 characters"),
    image: z.string().url("Invalid image URL").regex(/^https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?$/i, "Invalid image URL format"),
});

export const updateBlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(200, "Title must be less than 200 characters").optional(),
    content: z.string().min(20, "Content must be at least 20 characters long").max(50000, "Content must be less than 50,000 characters").optional(),
    image: z.string().url("Invalid image URL").regex(/^https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?$/i, "Invalid image URL format").optional(),
});

export const addReviewSchema = z.object({
    title: z.string().min(3, "Title must be minimum 3 characters long").max(100, "Title must be less than 100 characters"),
    description: z.string().min(10, "Description must be minimum 10 characters long").max(1000, "Description must be less than 1000 characters"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    blogSlug: z.string().min(1, "Blog slug is required"),
});