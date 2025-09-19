import { createBlog, getAllBlogPostOfMyself, getBlog, updateBlog } from "../controllers/blog.controllers";
import e, { type NextFunction, type Request, type Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const route = e.Router();

const testing = (req: Request, res:Response, next:NextFunction) => {
    console.log(req.userId)
    console.log("whyyyyyyyyyyyy errrorr")
    next()
}

route.post("/",authMiddleware ,createBlog);
route.put("/",authMiddleware ,updateBlog);
route.get("/:id",authMiddleware ,getBlog);
route.get("/", authMiddleware, getAllBlogPostOfMyself);

export default route