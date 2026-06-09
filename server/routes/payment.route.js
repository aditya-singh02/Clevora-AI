import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { createOrder, handleFailedPayment, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.route("/order").post(verifyJWT, authRateLimiter, createOrder);
paymentRouter.route("/verify").post(verifyJWT, authRateLimiter,  verifyPayment);
paymentRouter.route("/failed").post(verifyJWT, authRateLimiter, handleFailedPayment);

export default paymentRouter;