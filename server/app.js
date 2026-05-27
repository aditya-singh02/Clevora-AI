import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"; 
import router from "./routes/auth.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({  
  origin: process.env.CORS_ORIGIN, // Allow requests from the specified origin
  credentials: true 
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());  

app.use("/api/v1/auth", router);  


export default app; 