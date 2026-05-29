import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { analyzeResume, startInterview } from "../controllers/interview.controller.js";
import upload from "../middlewares/multer.middleware.js";
 


const interviewRouter = express.Router();

interviewRouter.route("/resume").post(
    verifyJWT,
    upload.single("resume"), 
    analyzeResume
)

interviewRouter.route("/start").post(
    verifyJWT, 
    startInterview
)

export default interviewRouter;