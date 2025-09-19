import e, { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser"
import AuthRoute from "./routers/auth.route";
import BlogRoute from "./routers/blog.route";
import { config } from "dotenv";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth.middleware";
import { rateLimiter } from "./middlewares/rateLimiter";
import { errorMiddleware } from "./middlewares/errorMiddleware";

config(); 

const PORT = process.env.PORT || 5000;
const app = e();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(e.json());
app.use(cookieParser())

app.use(rateLimiter);
app.use("/api/auth", AuthRoute);
app.use("/api/blog", authMiddleware, BlogRoute);

// app.all("/:path*", (req:Request, res:Response, next:NextFunction) => {
//     next({status: 404, message: "Route not found"})
// })

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})