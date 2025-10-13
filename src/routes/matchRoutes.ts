import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { MatchController } from "../controllers/matchController.js";

const router = Router();
const matchController = new MatchController();

// 🔹 Rota protegida - o usuário precisa estar logado
router.post("/", authMiddleware, (req, res) => matchController.registerMatch(req, res));
router.get("/", authMiddleware, (req, res) => matchController.getUserMatches(req, res));

export default router;
