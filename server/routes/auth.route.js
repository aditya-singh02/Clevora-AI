import express from "express";
import { googleAuth, logoutUser } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const authRouter = express.Router();

authRouter.route("/google").post(googleAuth);
authRouter.route("/logout").post(verifyJWT, logoutUser);

export default authRouter;