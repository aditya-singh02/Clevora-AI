import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.route("/order").post(verifyJWT, createOrder);
paymentRouter.route("/verify").post(verifyJWT, verifyPayment); 

export default paymentRouter;