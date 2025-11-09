import { Router } from "express";
import { AchievementController } from "../controllers/achievementController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new AchievementController();

router.get("/", controller.getAllAchievements);
router.get("/me/unlocked", authMiddleware, controller.getUserAchievements);
router.get("/me",authMiddleware, controller.getAchievementsWithProgress); //removi o authMiddleware daqui, problema no front

export default router;
