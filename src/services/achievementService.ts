import { UserStats } from "@prisma/client";
import { AchievementRepository } from "../repositories/achievementRepository.js";
import { UserStatsService } from "./userStatsService.js";
import { AchievementWithProgress } from "../types/achievement.js";

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
    if (!stats) return;

    const allAchievements = await achievementRepository.findAllAchievements();
    const unlocked = await achievementRepository.findByUserId(userId);
    const unlockedIds = new Set(unlocked.map((ua) => ua.achievementId));

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.achievementId)) {
        continue;
      }

      const requiredStat = achievement.requiredStat as keyof UserStats;
      const requiredValue = achievement.requiredValue;

      if (requiredStat && requiredValue) {
        const userValue = stats[requiredStat] as number;
        if (userValue >= requiredValue) {
          await this.unlockAchievement(userId, achievement.achievementId);
        }
      }
    }
  }

  async getAchievementsWithProgress(userId: number): Promise<AchievementWithProgress[]> {
    const userStats = await userStatsService.getStats(userId);
    const allAchievements = await achievementRepository.findAllAchievements();
    const userAchievements = await achievementRepository.findByUserId(userId);
    const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId));

    return allAchievements.map(achievement => {
      const isUnlocked = unlockedAchievementIds.has(achievement.achievementId);
      const requiredStat = achievement.requiredStat as keyof UserStats;
      const requiredValue = achievement.requiredValue || 0;
      const currentValue = userStats ? (userStats[requiredStat] as number || 0) : 0;
      const progress = requiredValue > 0 ? Math.min((currentValue / requiredValue) * 100, 100) : 0;

      return {
        ...achievement,
        isUnlocked,
        progress,
        currentValue,
      };
    });
  }
}
