// auth/register, auth/login

import { Router } from "express";
import { AuthController } from "../auth/authController.js"

const router = Router();
const controller = new AuthController();

router.post("/auth/register", (req, res) => controller.register(req, res));
router.post("/auth/login", (req, res) => controller.login(req, res));

export default router;
