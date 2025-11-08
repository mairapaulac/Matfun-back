import { MatchRepository } from "../repositories/matchRepository.js";
import { UserStatsService } from "./userStatsService.js";
import { AchievementService } from "./achievementService.js";
import { prisma } from "../prisma/client.js";

const matchRepository = new MatchRepository();
const userStatsService = new UserStatsService();
const achievementService = new AchievementService();

export class MatchService {
  async registerMatch(data: {
    userId: number;
    scoreGained: number;
    questionsCorrect: number;
    questionsIncorrect: number;
    fractionsQuestions: number;
    geometryQuestions: number;
    algebraQuestions: number;
    percentageQuestions: number;
  }) {
    const { userId } = data;

    await userStatsService.ensureExists(userId);

    const match = await prisma.$transaction(async (tx) => {
      // 1. Registra a partida
      const newMatch = await matchRepository.createMatch(data, tx);

      // 2. Atualiza os stats do usuário
      await matchRepository.updateUserStats(userId, data, tx);

      return newMatch;
    });

    // 3. Verifica e desbloqueia conquistas, se aplicável (após a transação)
    await achievementService.checkUserAchievements(userId);

    return match;
  }

  async getUserMatches(userId: number) {
    return await matchRepository.getUserMatches(userId);
  }
}
