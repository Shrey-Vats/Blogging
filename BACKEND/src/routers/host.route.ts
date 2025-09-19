
import { createBlog, getAllBlogPostOfMyself, getBlog, updateBlog } from "../controllers/blog.controllers";
import e from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadImage } from "../controllers/host.controller";
import multer from "multer"
const route = e.Router();

const storage = multer.memoryStorage();
const upload = multer({storage})
route.post("/", authMiddleware, upload.single("file"), uploadImage)

export default route