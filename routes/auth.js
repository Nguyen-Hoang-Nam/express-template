import express from "express";
import controller from "../controllers/auth.js";

const router = express.Router();

router.post("/login", controller.login);

router.post("/register", controller.register);

router.post("/logout", controller.logout);

router.post("/forgot-password", controller.forgotPassword);

router.post("/verify-email", controller.verifyEmail);

router.post("/reset-password", controller.resetPassword);

export default router;
