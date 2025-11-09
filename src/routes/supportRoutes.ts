import { Router } from "express";
import { SupportController } from "../controllers/supportController.js";

const router = Router();
const supportController = new SupportController();

router.get("/escolas", supportController.getAllSchools);
router.get("/escolas/:id/anos", supportController.getGradesBySchool);
router.get("/anos/:id/turmas", supportController.getClassesByGrade);

export default router;
