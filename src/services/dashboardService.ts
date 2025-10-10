import { DashboardRepository } from "../repositories/dashboardRepository.js";

const dashboardRepository = new DashboardRepository();

export class DashboardService {

    async getDashboardData(userId: number) {
        
        const userData = await dashboardRepository.getDashboardData(userId);

        if(!userData) 
            throw new Error("Usuário não encontrado");


        //userClass nesse caso é apenas class do model user só que renomeado para evitar conflitos :)

        const { name, class: userClass, stats, achievements} = userData;

        //retornar o DTO pro frontend
        
        return {
            navbar: {
                nomeUsuario: name,
                turma: `${userClass.classLetter}`,
                ano: userClass.grade.gradeName,
                escola: userClass.grade.school.school_name,
            },
            dashboard: {
                totalScore: stats?.totalScore ?? 0,
                correctQuestions: stats?.totalCorrect ?? 0,
                algebraCorrectAnswers: stats?.algebraCorrect ?? 0,
                geometryCorrectAnswers: stats?.geometryCorrect ?? 0,
                consecutiveLoginDays: stats?.loginStreak?? 0,
            },
            achievements: achievements.map((a) => ({
                id: a.achievement.achievementId,
                name: a.achievement.achievementName,
                //icon: a.achievement.achievementIcon,
                description: a.achievement.achievementDescription,
            })),
        };

    }


}