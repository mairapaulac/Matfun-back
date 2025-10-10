import { prisma } from "../prisma/client.js";

export class AchievementRepository {
    
    async findAllAchievements() {
        return prisma.achievement.findMany();
    }

    
    async findByUserId(userId: number) {
        return prisma.userAchievements.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
        });
    }
    

    //associoa uma conquista a um usuário quando desbloqueada
    async unlockAchievement(userId: number, achievementId: number) {
        return prisma.userAchievements.create({
            data: {
                userId,
                achievementId,
            },
        });
    }
}