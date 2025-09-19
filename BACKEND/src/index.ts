import e from "express";
import cookieParser from "cookie-parser"
import AuthRoute from "./routers/auth.route";
import BlogRoute from "./routers/blog.route";
import { config } from "dotenv";
import cors from "cors";
config(); 

const PORT = process.env.PORT || 5000;
const app = e();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(e.json());
app.use(cookieParser())

app.use("/api/auth", AuthRoute);
app.use("/api/blog", BlogRoute);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})