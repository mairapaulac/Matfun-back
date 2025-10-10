import { SupportRepository } from "../repositories/supportRepository.js";

const supportRepository = new SupportRepository();

export class SupportService {
    
  async getSchools() {
    return supportRepository.getAllSchools();
  }

  async getGradesBySchool(schoolId: number) {
    return supportRepository.getGradesBySchool(schoolId);
  }

  async getClassesByGrade(gradeId: number) {
    return supportRepository.getClassesByGrade(gradeId);
  }
}
