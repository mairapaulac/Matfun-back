import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/client.js";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class MatchRepository {
  async createMatch(
    data: {
      userId: number;
      scoreGained: number;
      questionsCorrect: number;
      questionsIncorrect: number;
      fractionsQuestions: number;
      geometryQuestions: number;
      algebraQuestions: number;
      percentageQuestions: number;
    },
    tx?: PrismaTransactionClient
  ) {
    const db = tx || prisma;
    return db.match.create({
      data: {
        userId: data.userId,
        scoreGained: data.scoreGained,
        questionsCorrect: data.questionsCorrect,
        questionsIncorrect: data.questionsIncorrect,
        fractionsQuestions: data.fractionsQuestions,
        geometryQuestions: data.geometryQuestions,
        algebraQuestions: data.algebraQuestions,
        percentageQuestions: data.percentageQuestions,
      },
    });
  }

  async getUserMatches(userId: number) {
    return prisma.match.findMany({
      where: { userId },
      orderBy: { playedAt: "desc" },
    });
  }

  async updateUserStats(
    userId: number,
    data: {
      scoreGained: number;
      questionsCorrect: number;
      questionsIncorrect: number;
      fractionsQuestions: number;
      geometryQuestions: number;
      algebraQuestions: number;
      percentageQuestions: number;
    },
    tx?: PrismaTransactionClient
  ) {
    const db = tx || prisma;
    const totalAnswered = data.questionsCorrect + data.questionsIncorrect;

    return db.userStats.update({
      where: { userId },
      data: {
        totalScore: { increment: data.scoreGained },
        totalCorrect: { increment: data.questionsCorrect },
        totalIncorrect: { increment: data.questionsIncorrect },
        totalErrors: { increment: data.questionsIncorrect },
        answeredQuestions: { increment: totalAnswered },
        algebraCorrect: { increment: data.algebraQuestions },
        geometryCorrect: { increment: data.geometryQuestions },
        fractionsCorrect: { increment: data.fractionsQuestions },
        percentageCorrect: { increment: data.percentageQuestions },
      },
    });
  }
}
