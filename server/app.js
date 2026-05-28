import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"; 
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
import interviewRouter from './routes/interview.route.js';

dotenv.config();

const app = express();

app.use(cors({  
  origin: process.env.CORS_ORIGIN, // Allow requests from the specified origin
  credentials: true 
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());  

app.use("/api/v1/auth", authRouter);  // Mount the authentication routes at /api/v1/auth
app.use("/api/v1/user", userRouter); // Mount the user routes at /api/v1/user
app.use("/api/v1/interview", interviewRouter); // Mount the interview routes at /api/v1/interview


export default app; 