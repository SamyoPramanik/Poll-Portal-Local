import { Router } from "express";
import {
    profileInfo,
    signIn,
    signOut,
    signUp,
    updatePassword,
} from "../controllers/AuthController.js";

const authRouter = Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);
authRouter.get("/sign-out", signOut);
authRouter.get("/profile", profileInfo);
authRouter.post("update-password", updatePassword);

export default authRouter;
