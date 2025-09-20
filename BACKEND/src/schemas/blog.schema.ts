import z from "zod";

export const createBlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    content: z.string().min(20, "Content must be at least 20 characters long"),
    image: z.string().regex(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i, "Invalid image URL"),
    id: z.string().optional()
})

export const addReviewSchema = z.object({
    title: z.string().min(3, "Title must be minimum 3 cherecter long"),
    description: z.string().min(10, "Description must be minimum 3 cherecter long"),
    rating: z.number().min(0).max(5),
    blogSlug: z.string().optional()
})