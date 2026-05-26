import express from "express";
import { googleAuth, logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/google").post(googleAuth);
router.route("/logout").post(logoutUser);

export default router;