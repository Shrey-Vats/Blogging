import { signIn, signUp, logOut } from "../controllers/auth.controllers";
import e from "express";

const route = e.Router();

route.post("/sign-in", signIn);
route.post("/sign-up", signUp);
route.get("/logout", logOut);

export default route