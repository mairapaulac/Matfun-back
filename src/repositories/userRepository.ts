//Aqui nos permite acessar o banco de dados através do prismaORM referente à tabela de usuários

import { prisma } from "../prisma/client.js"


export class userRepository {

    async findByEmail(email: string) {
        return await prisma.user.findUnique({ 
            where: { email },
            include: { stats: true, achievements: true, matches: true, ranking: true} //traz as estatísticas junto se for preciso
        });
    }

    async findAllUsers() {
        return await prisma.user.findMany()
    }
    
    async findByClass(classId: number) {
        return await prisma.user.findMany({
            where: { classId }
        });
    }

    async createUser(data: {
        name: string;
        email: string;
        senha: string; //já vem hasheada
        dataNascimento: Date;
        classId: number;
    }) {
        return await prisma.user.create({
            data: {
                ...data,
                stats: {
                    create: {
                        totalScore: 0,
                        totalCorrect: 0,
                        loginStreak: 0,
                        algebraCorrect: 0,
                        geometryCorrect: 0,
                        lastLoginDate: new Date(),
                    },
                },
            },
            include: {stats: true},
        });
    }

    async updateLastLogin(userId: number) { 
        return await prisma.userStats.upsert({
            where: { userId },
            update: {lastLoginDate: new Date() },
            create: {
                userId,
                totalScore: 0,
                totalCorrect: 0,
                loginStreak: 0,
                algebraCorrect: 0,
                geometryCorrect: 0,
                lastLoginDate: new Date(),
            },
        });
    }
}

