import { MatchRepository } from "../repositories/matchRepository.js";
import { UserStatsService } from "./userStatsService.js";
import { AchievementService } from "./achievementService.js";

const matchRepository = new MatchRepository();
const userStatsService = new UserStatsService();
const achievementService = new AchievementService();

export class MatchService {
  async registerMatch(data: {
    userId: number;
    scoreGained: number;
    questionsCorrect: number;
    fractionsQuestions: number;
    geometryQuestions: number;
    algebraQuestions: number;
  }) {
    const { userId } = data;

    // 🔹 Garante que o userStats exista (caso o user seja novo)
    await userStatsService.ensureExists(userId);

    // 🔹 Registra a partida
    const match = await matchRepository.createMatch(data);

    // 🔹 Atualiza os stats do usuário
    await matchRepository.updateUserStats(userId, data);

    // 🔹 Verifica e desbloqueia conquistas, se aplicável
    await achievementService.checkUserAchievements(userId);

    return match;
  }

  async getUserMatches(userId: number) {
    return await matchRepository.getUserMatches(userId);
  }
}
