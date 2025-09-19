import z from "zod";

export const createBlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    content: z.string().min(20, "Content must be at least 20 characters long"),
    image: z.string().regex(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i, "Invalid image URL"),
    id: z.string().optional()
})