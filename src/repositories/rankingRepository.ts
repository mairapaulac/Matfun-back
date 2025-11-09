import { prisma } from '../prisma/client.js';

export class RankingRepository {

  public async getGeneralRanking() {
    return prisma.userStats.findMany({
      orderBy: {
        totalScore: 'desc',
      },
      take: 100,
      include: {
        user: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });
  }

  public async getClassRanking(classId: number){
    return prisma.userStats.findMany({
        where:{
            user:{
                classId 
            },
        },
        orderBy: {
        totalScore: 'desc',
      },
      take: 100,
      include: {
        user: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });
  }
}
