import { RankingRepository } from '../repositories/rankingRepository.js';

const rankingRepository = new RankingRepository();

class RankingService {

  public async getGeneralRanking() {
    const stats = await rankingRepository.getGeneralRanking();

    //formata o ranking 
    const formattedRanking = stats.map((stat, index) => ({
      rank: index + 1,
      user: {
        userId: stat.user.userId,
        name: stat.user.name,
      },
      score: stat.totalScore,
    }));

    return formattedRanking;
  }

  public async getClassRanking(classId: number){
    const stats = await rankingRepository.getClassRanking(classId);

    const formattedRanking = stats.map((stat, index) => ({
      rank: index + 1,
      user: {
        userId: stat.user.userId,
        name: stat.user.name,
      },
      score: stat.totalScore,
    }));

    return formattedRanking;
  }
}

export default new RankingService();