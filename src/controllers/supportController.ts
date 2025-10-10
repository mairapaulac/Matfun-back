import { Request, Response } from "express";
import { SupportService } from "../services/supportService.js";

const supportService = new SupportService();

export class SupportController {

  async getAllSchools(res: Response) {
    const schools = await supportService.getSchools();
    return res.json(schools);
  }

  async getGradesBySchool(req: Request, res: Response) {
    const schoolId = Number(req.params.id);
    const grades = await supportService.getGradesBySchool(schoolId);
    return res.json(grades);
  }

  async getClassesByGrade(req: Request, res: Response) {
    const gradeId = Number(req.params.id);
    const classes = await supportService.getClassesByGrade(gradeId);
    return res.json(classes);
  }
}
