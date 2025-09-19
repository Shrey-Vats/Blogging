import z from "zod"

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})
export const signInSchema = z.object({
    email: z.string(),
    password: z.string()
})