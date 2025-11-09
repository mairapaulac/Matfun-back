import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const dashboardController = new DashboardController();

router.get("/", authMiddleware, (req, res) =>
  dashboardController.getDashboard(req, res)
);

export default router;
