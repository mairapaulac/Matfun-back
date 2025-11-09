import { UserStatsRepository } from "../repositories/userStatsRepository.js";

const userStatsRepository = new UserStatsRepository();

export class UserStatsService {
  async getStats(userId: number) {
    return await userStatsRepository.findByUserId(userId);
  }

  async updateStats(userId: number, data: {
    totalScore: number;
    totalCorrect: number;
    loginStreak: number;
    algebraCorrect: number;
    geometryCorrect: number;
  }) {
    return await userStatsRepository.updateStats(userId, data);
  }

  async incrementStat(userId: number, field: keyof {
    totalScore: number;
    totalCorrect: number;
    loginStreak: number;
    algebraCorrect: number;
    geometryCorrect: number;
  }, value: number) {
    return await userStatsRepository.incrementStat(userId, field, value);
  }

  async ensureExists(userId: number) {
    const existing = await userStatsRepository.findByUserId(userId);
    if (!existing) {
      await userStatsRepository.createDefault(userId);
    }
  }
}
