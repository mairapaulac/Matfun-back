import { prisma } from "../prisma/client.js";

export class SupportRepository {

    async getAllSchools() {
        return prisma.school.findMany({
            select: { schoolId: true, school_name: true},
        });
    }

    async getGradesBySchool(schoolId: number) {
        return prisma.grade.findMany({
            where: { schoolId },
            select: { gradeId: true, gradeName: true },
        });
    }

    async getClassesByGrade(gradeId: number) {
        return prisma.class.findMany({
            where: { gradeId },
            select: { classId: true, classLetter: true },
        });
    }
}