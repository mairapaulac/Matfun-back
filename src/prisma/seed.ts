import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";
import { AchievementService } from "../services/achievementService.js";

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

      const achievementOptions = [
        { stat: 'totalCorrect', value: 200 },
        { stat: 'algebraCorrect', value: 100 },
        { stat: 'geometryCorrect', value: 100 },
        { stat: 'fractionsCorrect', value: 100 },
        { stat: 'percentageCorrect', value: 100 }
      ];

      for (let i = 0; i < numStudents; i++) {
        const baseName = generateRandomName();
        const uniqueSuffix = `${turma.classId}-${i}`;
        const name = `${baseName} ${uniqueSuffix}`;
        const email = `${baseName
          .toLowerCase()
          .replace(" ", ".")}.${uniqueSuffix}@example.com`;

        const achievementToGrant = achievementOptions[getRandomInt(0, achievementOptions.length - 1)];

        if (!achievementToGrant) {
          throw new Error("Falha ao selecionar uma conquista aleatória para o usuário no seed.");
        }
        
        const statsData: any = {
          totalScore: getRandomInt(100, 5000),
          totalCorrect: getRandomInt(20, 199),
          answeredQuestions: getRandomInt(200, 500),
          loginStreak: getRandomInt(0, 15),
          algebraCorrect: getRandomInt(5, 99),
          geometryCorrect: getRandomInt(5, 99),
          fractionsCorrect: getRandomInt(5, 99),
          percentageCorrect: getRandomInt(5, 99),
          lastLoginDate: new Date(),
        };

        statsData[achievementToGrant.stat] = achievementToGrant.value;

        if (achievementToGrant.stat !== 'totalCorrect' && achievementToGrant.stat.endsWith('Correct')) {
          statsData.totalCorrect = Math.max(statsData.totalCorrect, statsData[achievementToGrant.stat]);
        }

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
              create: statsData,
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
        achievementName: "Guerreiro Matemático",
        achievementDescription: "Você enfrentou 200 desafios numéricos e saiu vitorioso!",
        requiredStat: "totalCorrect",
        requiredValue: 200,
        achievementIcon: "Sword",
        achievementCategory:"general",
        iconColor : "#F43F5E"
      },
      {
        achievementName: "Alquimista da Álgebra",
        achievementDescription: "Transformou letras em números como um verdadeiro mestre das fórmulas!",
        requiredStat: "algebraCorrect",
        requiredValue: 100,
        achievementIcon: "Amphora",
        achievementCategory:"algebra",
        iconColor : "#22C55E"
      },
      {
        achievementName: "Mago das Formas",
        achievementDescription: "Conhece cada ângulo, círculo e triângulo do reino geométrico!",
        requiredStat: "geometryCorrect",
        requiredValue: 100,
        achievementIcon: "WandSparkles",
        achievementCategory:"geometry",
        iconColor : "#22D3EE"
      },
      {
        achievementName: "Ninja das Frações",
        achievementDescription: "Dividiu e conquistou cada parte. A matemática nunca foi tão precisa!",
        requiredStat: "fractionsCorrect",
        requiredValue: 100,
        achievementIcon: "Sparkle",
        achievementCategory:"fraction",
        iconColor : "#FACC15"
      },
      {
        achievementName: "Mestre das Porcentagens",
        achievementDescription: "Calculou, comparou e multiplicou como um verdadeiro estrategista dos números!",
        requiredStat: "percentageCorrect",
        requiredValue: 100,
        achievementIcon: "GraduationCap",
        achievementCategory:"percentage",
        iconColor : "#c76ab3ff"
      },
    ],
  });

  // --- 5. CRIAÇÃO DE UM UTILIZADOR ESPECIAL PARA TESTES DE CONQUISTAS ---
  console.log("🦸 Criando um utilizador especial para testes de conquistas...");

  

  const heroi = await prisma.user.create({
    data: {
      name: "Herói das Conquistas",
      email: "heroi@example.com",
      senha: senhaHash,
      dataNascimento: new Date("2010-01-01"),
      classId: allCreatedUsers[0].classId, // associa à mesma turma do primeiro utilizador
      stats: {
        create: {
          totalScore: 9999,
          totalCorrect: 250, 
          answeredQuestions: 300,
          loginStreak: 20,
          algebraCorrect: 110, 
          geometryCorrect: 50,
          fractionsCorrect: 50,
          percentageCorrect: 10, 
          lastLoginDate: new Date(),
        },
      },
    },
  });
  allCreatedUsers.push(heroi); 

  console.log("🏅 Verificando e atribuindo conquistas com base nos stats...");
  const achievementService = new AchievementService();
  for (const user of allCreatedUsers) {
    await achievementService.checkUserAchievements(user.userId);
  }

  // --- 7. CRIAÇÃO DE PARTIDAS (MATCHES) ---
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
