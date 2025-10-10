import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new UserController();

router.get("/", controller.getAll); // lista todos
router.get("/:id", controller.getById); // pega um por id
router.post("/", controller.create); // cria novo usuário
router.get("/me/profile", authMiddleware, controller.getProfile); // pega dados do próprio user autenticado

export default router;
