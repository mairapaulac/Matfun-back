import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import 'dotenv/config'; // <-- ADICIONE ESTA LINHA

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1️⃣ Cria escola
  const school = await prisma.school.create({
    data: {
      school_name: "Escola Estadual MatFun",
    },
  });

  // 2️⃣ Cria anos/séries
  const grade = await prisma.grade.create({
    data: {
      gradeName: "9º Ano",
      schoolId: school.schoolId,
    },
  });

  // 3️⃣ Cria turma
  const turma = await prisma.class.create({
    data: {
      classLetter: "A",
      gradeId: grade.gradeId,
    },
  });

  // 4️⃣ Cria usuários
  const senhaHash = await bcrypt.hash("123456", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "Maria Oliveira",
      email: "maria@example.com",
      senha: senhaHash,
      dataNascimento: new Date("2009-05-10"),
      classId: turma.classId,
      createdAt: new Date(),
      stats: {
        create: {
          totalScore: 1500,
          totalCorrect: 80,
          answeredQuestions: 120,
          loginStreak: 5,
          algebraCorrect: 40,
          geometryCorrect: 20,
          lastLoginDate: new Date(),
        },
      },
    },
    include: { stats: true },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "João Santos",
      email: "joao@example.com",
      senha: senhaHash,
      dataNascimento: new Date("2008-09-20"),
      classId: turma.classId,
      createdAt: new Date(),
      stats: {
        create: {
          totalScore: 800,
          totalCorrect: 30,
          answeredQuestions: 60,
          loginStreak: 2,
          algebraCorrect: 10,
          geometryCorrect: 5,
          lastLoginDate: new Date(),
        },
      },
    },
    include: { stats: true },
  });

  // 5️⃣ Cria conquistas
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        achievementId: 1,
        achievementName: "Começo Brilhante",
        achievementDescription: "Complete sua primeira partida.",
        //achievementIcon: "⭐",
      },
      {
        achievementId: 2,
        achievementName: "Gênio da Álgebra",
        achievementDescription: "Acerte 20 questões de álgebra.",
        //achievementIcon: "📘",
      },
      {
        achievementId: 3,
        achievementName: "Mestre da Geometria",
        achievementDescription: "Acerte 20 questões de geometria.",
        //achievementIcon: "📐",
      },
      {
        achievementId: 4,
        achievementName: "Foco Total",
        achievementDescription: "Acesse por 7 dias consecutivos.",
        //achievementIcon: "🔥",
      },
      {
        achievementId: 5,
        achievementName: "Pontuação Milionária",
        achievementDescription: "Alcance 1000 pontos no total.",
        //achievementIcon: "🏆",
      },
    ],
  });

  // 6️⃣ Associa conquistas a um usuário
  await prisma.userAchievements.createMany({
    data: [
      { userId: user1.userId, achievementId: 1 },
      { userId: user1.userId, achievementId: 2 },
      { userId: user1.userId, achievementId: 3 },
    ],
  });

  // 7️⃣ Cria algumas partidas (matches)
  await prisma.match.createMany({
    data: [
      {
        userId: user1.userId,
        scoreGained: 200,
        questionsCorrect: 10,
        fractionsQuestions: 5,
        geometryQuestions: 3,
        algebraQuestions: 2,
      },
      {
        userId: user1.userId,
        scoreGained: 300,
        questionsCorrect: 15,
        fractionsQuestions: 4,
        geometryQuestions: 5,
        algebraQuestions: 6,
      },
      {
        userId: user2.userId,
        scoreGained: 150,
        questionsCorrect: 8,
        fractionsQuestions: 3,
        geometryQuestions: 3,
        algebraQuestions: 2,
      },
    ],
  });

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
