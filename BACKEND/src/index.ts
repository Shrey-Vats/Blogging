import e from "express";
import cookieParser from "cookie-parser"
import AuthRoute from "./routers/auth.route";
import BlogRoute from "./routers/blog.route";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth.middleware";
import { rateLimiter } from "./middlewares/rateLimiter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { config } from "dotenv";
import route from "./routers/host.route";
config(); 

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = e();
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}))
app.use(e.json());
app.use(cookieParser())

app.use(rateLimiter);
app.use("/api/auth", AuthRoute);
app.use("/api/blog", authMiddleware, BlogRoute);
app.use("/api/upload", authMiddleware, route)

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})