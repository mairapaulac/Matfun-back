import { prisma } from '../prisma/client.js';

class RankingService {

  public async getGeneralRanking() {
    const stats = await prisma.userStats.findMany({
      // ordena pontuação do maior p/ menor
      orderBy: {
        totalScore: 'desc',
      },
      // busca 100 users
      take: 100,
      // payload retornardo pela consulta
      include: {
        user: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });

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
    const stats = await prisma.userStats.findMany({
        where:{
            user:{
                classId 
            },
        },
        orderBy: {
        totalScore: 'desc',
      },
      // busca 100 users
      take: 100,
      // payload retornardo pela consulta
      include: {
        user: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });

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