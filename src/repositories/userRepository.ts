//Aqui nos permite acessar o banco de dados através do prismaORM referente à tabela de usuários

import { prisma } from "../prisma/client.js"


export class userRepository {

    async findByEmail(email: String) {
        return prisma.user.findUnique({ 
            where: { email },
            include: { stats: true} //traz as estatísticas junto se for preciso
        });
    }

    async createUser(data: {
        name: string;
        email: string;
        senha: string; //já vem hasheada
        dataNascimento: Date;
        classId: number;
    }) {
        return prisma.user.create({
            data: {
                ...data,
                stats: {
                    create: {
                        totalScore: 0,
                        correctQuestions: 0,
                        answeredQuestions: 0,
                        consecutiveLoginDays: 0,
                        algebraCorrectAnswers: 0,
                        geometryCorretctAnswers: 0,
                        lastLogin: new Date(),
                    },
                },
            },
            include: {stats: true},
        });
    }

    async updateLastLogin(userId: number) { 
        return prisma.userStats.upsert({
            where: { userId },
            update: {lastLogin: new Date() },
            create: {
                userId,
                totalScore: 0,
                correctQuestions: 0,
                answeredQuestions: 0,
                consecutiveLoginDays: 0,
                algebraCorrectAnswers: 0,
                geometryCorrectAnswers: 0,
                lastLogin: new Date(),
            },
        });
    }
}

