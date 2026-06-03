import express from "express";
import { 
    googleAuth, 
    registerUser, 
    logoutUser, 
    loginUser, 
    forgotPassword, 
    resetPassword,
    verifyOtp
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const authRouter = express.Router();

//Public & Open (Only Global Limiter from app.js applies here, which is perfect)
authRouter.route("/google").post(googleAuth); // Google Auth route is not protected by authRateLimiter because it uses OAuth flow which has its own rate limits and security measures, so it doesn't need the same rate limiting as traditional login routes.
authRouter.route("/register").post(registerUser); 
authRouter.route("/verify-otp").post(verifyOtp);

// Strict Security Guards(Only 5 attempts allowed per 15 mins)
authRouter.route("/login").post(authRateLimiter, loginUser);
authRouter.route("/forgot-password").post(authRateLimiter, forgotPassword);

//Token protected
authRouter.route("/reset-password").post(resetPassword); //authRateLimiter is not applied here because reset-password is accessed via a secure token sent to the user's email, so it doesn't need the same rate limiting as login or forgot-password routes.
authRouter.route("/logout").post(verifyJWT, logoutUser);

export default authRouter;