import { AchievementRepository } from "../repositories/achievementRepository.js";

const achievementRepository = new AchievementRepository();

export class AchievementService {

    async getAllAchievements() {
        return await achievementRepository.findAllAchievements();
    }

    async getUserAchievements(userId: number) {
        return await achievementRepository.findByUserId(userId);
    }

    async unlockAchievement(userId: number, achievementId: number) {
        //Verifica se a conquista já foi desbloqueada
        const existingUsr = await achievementRepository.findByUserId(userId);
        const alreadyUnlocked = existingUsr.some( (userAchievement => 
            userAchievement.achievementId == achievementId
        ));

        if (alreadyUnlocked) {
            throw new Error("Conquista já desbloqueada");
        }

        return await achievementRepository.unlockAchievement(userId, achievementId);
    }
    
}