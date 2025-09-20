
import e from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload, uploadImage } from "../controllers/host.controller";

const route = e.Router();

route.post("/", authMiddleware, upload.single("file"), uploadImage)

export default route 