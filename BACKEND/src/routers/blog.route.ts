import { createBlog, getAllBlogPostOfMyself, getBlog, updateBlog } from "../controllers/blog.controllers";
import e, { type NextFunction, type Request, type Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const route = e.Router();

route.post("/", createBlog);
route.put("/", updateBlog);
route.get("/:id", getBlog);
route.get("/my-blogs", getAllBlogPostOfMyself);

export default route