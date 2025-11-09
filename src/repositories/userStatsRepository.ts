import { prisma } from "../prisma/client.js";

export class UserStatsRepository {
  async findByUserId(userId: number) {
    return prisma.userStats.findUnique({
      where: { userId },
    });
  }

  async createDefault(userId: number) {
    return prisma.userStats.create({
      data: {
        userId,
        totalScore: 0,
        totalCorrect: 0,
        answeredQuestions: 0,
        loginStreak: 0,
        algebraCorrect: 0,
        geometryCorrect: 0,
        lastLoginDate: new Date(),
      },
    });
  }

  async updateStats(userId: number, data: {
    totalScore: number;
    totalCorrect: number;
    loginStreak: number;
    algebraCorrect: number;
    geometryCorrect: number;
  }) {
    return prisma.userStats.update({
      where: { userId },
      data,
    });
  }

  async incrementStat(userId: number, field: keyof {
    totalScore: number;
    totalCorrect: number;
    loginStreak: number;
    algebraCorrect: number;
    geometryCorrect: number;
  }, value: number) {
    return prisma.userStats.update({
      where: { userId },
      data: {
        [field]: {
          increment: value,
        },
      },
    });
  }
}
