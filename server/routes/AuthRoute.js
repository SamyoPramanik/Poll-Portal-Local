import { Router } from "express";
import {
    profileInfo,
    signIn,
    signOut,
    signUp,
    updatePassword,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyEmail } from "../middlewares/verityEmail.js";

const authRouter = Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);
authRouter.get("/sign-out", signOut);
authRouter.get("/profile", verifyToken, profileInfo);
authRouter.post("update-password", verifyToken, updatePassword);

export default authRouter;
