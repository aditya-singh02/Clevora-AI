import express from "express";
import { 
    googleAuth, 
    registerUser, 
    logoutUser, 
    loginUser, 
    forgotPassword, 
    resetPassword 
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const authRouter = express.Router();

authRouter.route("/google").post(googleAuth);
authRouter.route("/register").post(registerUser)
authRouter.route("/login").post(loginUser)
authRouter.route("/forgot-password").post(forgotPassword)
authRouter.route("/reset-password").post(resetPassword)
authRouter.route("/logout").post(verifyJWT, logoutUser);

export default authRouter;