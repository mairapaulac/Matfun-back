
import { prisma } from "../prisma/client.js";


export class DashboardRepository {

    async getDashboardData(userId: number) {
       return prisma.user.findUnique( {
            where: { userId },
            include: {
                class: {
                    include: {
                        grade: {
                            include: {
                                school: true,
                            },
                        },
                    },
                },
                stats: true,
                achievements: { 
                    include: {
                        achievement: true,
                }},
            },
       });
    }



}