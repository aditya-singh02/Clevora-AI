import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : '*',
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser()); 

app.use(globalLimiter) // Apply global rate limiter.

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from './routes/interview.route.js';
import paymentRouter from './routes/payment.route.js';

app.use("/api/v1/auth", authRouter);  // Mount the authentication routes at /api/v1/auth
app.use("/api/v1/user", userRouter); 
app.use("/api/v1/interview", interviewRouter); 
app.use("/api/v1/payment", paymentRouter); 

// Global error handler - send consistent error responses to the client
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  return res.status(statusCode).json({
    statusCode,
    message,
    success: false,
    errors: err.errors || []
  })
})

export default app; 