import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import  {deleteAccount, getCurrentUser}  from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/current-user").get(verifyJWT, getCurrentUser)
userRouter.route("/delete-account").delete(verifyJWT, deleteAccount) //For account deletion from settings page .delete() method use because it's a destructive action

export default userRouter;