import express from "express";
import { googleAuth, registerUser, logoutUser, loginUser } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const authRouter = express.Router();

authRouter.route("/google").post(googleAuth);
authRouter.route("/logout").post(verifyJWT, logoutUser);
authRouter.route("/register").post(registerUser)
authRouter.route("/login").post(loginUser)


export default authRouter;