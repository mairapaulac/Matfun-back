import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient();

// --- Funções Auxiliares para Geração de Dados Aleatórios ---

// Gera um número inteiro aleatório num intervalo
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gera nomes de alunos aleatórios para dar mais realismo
function generateRandomName(): string {
  const firstNames = [
    "Ana",
    "Bruno",
    "Carla",
    "Daniel",
    "Eduarda",
    "Felipe",
    "Gabriela",
    "Heitor",
    "Isabela",
    "Jorge",
    "Larissa",
    "Miguel",
    "Natália",
    "Otávio",
    "Patrícia",
    "Rafael",
    "Sofia",
    "Thiago",
    "Úrsula",
    "Victor",
  ];
  const lastNames = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Pereira",
    "Lima",
    "Gomes",
    "Costa",
    "Ribeiro",
    "Martins",
    "Carvalho",
    "Almeida",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

async function main() {
  console.log("🌱 Iniciando seed...");

  // --- 1. LIMPEZA DO BANCO DE DADOS ---
  // Apaga os dados na ordem inversa das dependências para evitar erros de chave estrangeira
  console.log("🧹 Limpando dados existentes...");
  await prisma.userAchievements.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.ranking.deleteMany({});
  await prisma.userStats.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.grade.deleteMany({});
  await prisma.school.deleteMany({});

  // As conquistas são estáticas, então podemos recriá-las
  await prisma.achievement.deleteMany({});

  // --- 2. ESTRUTURA DA ESCOLA ---
  const schoolStructure = {
    name: "Colégio Estadual Rui Barbosa",
    grades: [
      { name: "6º ano", classes: ["A"] },
      { name: "7º ano", classes: ["A", "B"] },
      { name: "8º ano", classes: ["A", "B", "C", "D"] },
      { name: "9º ano", classes: ["A", "B", "C"] },
    ],
  };

  // --- 3. CRIAÇÃO DA HIERARQUIA E DOS ALUNOS ---
  console.log(`🏫 Criando a escola: ${schoolStructure.name}`);
  const school = await prisma.school.create({
    data: {
      schoolId: 1,
      school_name: schoolStructure.name,
    },
  });

  const senhaHash = await bcrypt.hash("123456", 10);
  const allCreatedUsers = []; // Array para guardar todos os utilizadores criados

  for (const gradeData of schoolStructure.grades) {
    console.log(`  📚 Criando o ano: ${gradeData.name}`);
    const grade = await prisma.grade.create({
      data: {
        gradeName: gradeData.name,
        schoolId: school.schoolId,
      },
    });

    for (const classLetter of gradeData.classes) {
      console.log(
        `    👩‍🏫 Criando a turma: ${gradeData.name} - Turma ${classLetter}`
      );
      const turma = await prisma.class.create({
        data: {
          classLetter: classLetter,
          gradeId: grade.gradeId,
        },
      });

      const numStudents = getRandomInt(5, 8);
      console.log(
        `      👤 Gerando ${numStudents} alunos para a turma ${classLetter}...`
      );

      for (let i = 0; i < numStudents; i++) {
        const baseName = generateRandomName();
        const name = `${baseName}#${getRandomInt(1000, 9999)}${i}`;
        const email = `${baseName
          .toLowerCase()
          .replace(" ", ".")}#${getRandomInt(1000, 9999)}${i}@example.com`;

        const user = await prisma.user.create({
          data: {
            name,
            email,
            senha: senhaHash,
            dataNascimento: new Date(
              `${getRandomInt(2008, 2012)}-${getRandomInt(
                1,
                12
              )}-${getRandomInt(1, 28)}`
            ),
            classId: turma.classId,
            stats: {
              create: {
                totalScore: getRandomInt(100, 5000),
                totalCorrect: getRandomInt(20, 200),
                answeredQuestions: getRandomInt(200, 500),
                loginStreak: getRandomInt(0, 15),
                algebraCorrect: getRandomInt(5, 50),
                geometryCorrect: getRandomInt(5, 50),
                fractionsCorrect: getRandomInt(5, 50),
                lastLoginDate: new Date(),
              },
            },
          },
        });
        allCreatedUsers.push(user);
      }
    }
  }

  // --- 4. CRIAÇÃO DAS CONQUISTAS (ACHIEVEMENTS) ---
  console.log("🏆 Criando conquistas...");
  await prisma.achievement.createMany({
    data: [
      {
        achievementName: "Começo Brilhante",
        achievementDescription: "Complete sua primeira partida.",
      },
      {
        achievementName: "Gênio da Álgebra",
        achievementDescription: "Acerte 20 questões de álgebra.",
        requiredStat: "algebraCorrect",
        requiredValue: 20,
      },
      {
        achievementName: "Mestre da Geometria",
        achievementDescription: "Acerte 20 questões de geometria.",
        requiredStat: "geometryCorrect",
        requiredValue: 20,
      },
      {
        achievementName: "Foco Total",
        achievementDescription: "Acesse por 7 dias consecutivos.",
        requiredStat: "loginStreak",
        requiredValue: 7,
      },
      {
        achievementName: "Pontuação Mil",
        achievementDescription: "Alcance 1000 pontos no total.",
        requiredStat: "totalScore",
        requiredValue: 1000,
      },
    ],
  });

  // --- 5. CRIAÇÃO DE PARTIDAS (MATCHES) - LÓGICA ANTIGA RESTAURADA ---
  console.log("🎮 Gerando histórico de partidas específicas...");
  if (allCreatedUsers.length >= 2) {
    const user1 = allCreatedUsers[0]; // Pega o primeiro usuário gerado
    const user2 = allCreatedUsers[1]; // Pega o segundo usuário gerado

    if (!user1 || !user2) {
      console.error(
        "⚠️ Falha ao obter utilizadores para criar partidas. Abortando."
      );
      return;
    }

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
  } else {
    console.log(
      "⚠️ Não foram gerados utilizadores suficientes para criar partidas específicas."
    );
  }

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
