import { prisma } from "../prisma/client.js";

export class MatchRepository {

  async createMatch(data: {
    userId: number;
    scoreGained: number;
    questionsCorrect: number;
    fractionsQuestions: number;
    geometryQuestions: number;
    algebraQuestions: number;
  }) {
    return prisma.match.create({ data });
  }

  async updateUserStats(userId: number, data: {
    scoreGained: number;
    questionsCorrect: number;
    fractionsQuestions: number;
    geometryQuestions: number;
    algebraQuestions: number;
  }) {
    return prisma.userStats.update({
      where: { userId },
      data: {
        totalScore: { increment: data.scoreGained },
        totalCorrect: { increment: data.questionsCorrect },
        // answeredQuestions: { increment: 
        //   data.fractionsQuestions + data.geometryQuestions + data.algebraQuestions 
        // },
        algebraCorrect: { increment: data.algebraQuestions },
        geometryCorrect: { increment: data.geometryQuestions },
      },
    });
  }
}
