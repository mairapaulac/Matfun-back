import { Router } from "express";
import { AchievementController } from "../controllers/achievementController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new AchievementController();

router.get("/", controller.getAllAchievements);
router.get("/me", authMiddleware, controller.getUserAchievements);

export default router;
