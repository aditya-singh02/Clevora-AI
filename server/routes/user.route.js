import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import  {getCurrentUser}  from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/current-user").get(verifyJWT, getCurrentUser)

export default userRouter;