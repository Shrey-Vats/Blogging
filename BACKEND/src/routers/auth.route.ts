import { signIn, signUp, logOut } from "../controllers/auth.controllers";
import e from "express";
import { createAccountLimiter } from "../middlewares/rateLimiter";

const route = e.Router();

route.post("/sign-in", createAccountLimiter, signIn);
route.post("/sign-up", createAccountLimiter, signUp);
route.get("/logout", logOut);

export default route