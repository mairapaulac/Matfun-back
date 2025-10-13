import { AchievementRepository } from "../repositories/achievementRepository.js";
import { UserStatsService } from "./userStatsService.js";

const achievementRepository = new AchievementRepository();
const userStatsService = new UserStatsService();

export class AchievementService {
  async getAllAchievements() {
    return await achievementRepository.findAllAchievements();
  }

  async getUserAchievements(userId: number) {
    return await achievementRepository.findByUserId(userId);
  }

  async unlockAchievement(userId: number, achievementId: number) {
    const existing = await achievementRepository.findByUserId(userId);
    const alreadyUnlocked = existing.some(
      (ua) => ua.achievementId === achievementId
    );

    if (alreadyUnlocked) return null; // Evita erro repetido

    return await achievementRepository.unlockAchievement(userId, achievementId);
  }

  async checkUserAchievements(userId: number) {
    const stats = await userStatsService.getStats(userId);
    // const allAchievements = await achievementRepository.findAllAchievements();
    const unlocked = await achievementRepository.findByUserId(userId);

    const unlockedIds = unlocked.map((ua) => ua.achievementId);

    
    const rules = [
      { condition: (stats as any).totalScore >= 1000, id: 1 }, // Pontuação total
      { condition: (stats as any).totalCorrect >= 50, id: 2 }, // Acertos totais
      { condition: (stats as any).geometryCorrect >= 20, id: 3 },
      { condition: (stats as any).algebraCorrect >= 20, id: 4 },
      { condition: (stats as any).loginStreak >= 7, id: 5 },
    ];

    for (const rule of rules) {
      if (rule.condition && !unlockedIds.includes(rule.id)) {
        await this.unlockAchievement(userId, rule.id);
      }
    }
  }
}
