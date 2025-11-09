//Aqui nos permite acessar o banco de dados através do prismaORM referente à tabela de usuários

import { prisma } from "../prisma/client.js"


export class UserRepository {

    async findByEmail(email: string) {
        return prisma.user.findUnique({ 
            where: { email },
            include: { stats: true, achievements: true, matches: true, ranking: true, class: { include: { grade: true } } } //traz as estatísticas junto se for preciso
        });
    }

    async findById(userId: number) {
        return prisma.user.findUnique({
            where: { userId },
            include: {
                stats: true,
                achievements: true,
                matches: true,
                ranking: true,
                class: { include: { grade: true } },
            },
        });
    }

    async findAllUsers() {
        return prisma.user.findMany()
    }
    
    async findByClass(classId: number) {
        return prisma.user.findMany({
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
        return prisma.user.create({
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
            include: {stats: true, class: { include: { grade: true } } },
        });
    }


    //Depois usar a tabela userStats, para que ela sempre exista após o cadastro

    async updateLastLogin(userId: number) { 
        return prisma.userStats.upsert({
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
