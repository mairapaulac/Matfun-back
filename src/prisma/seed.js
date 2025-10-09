import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o script de seed...');

  const escola = await prisma.school.upsert({
    where: { schoolId: 1 }, // tenta encontrar a escola com ID 1
    update: {}, // se encontrar, não faz nada
    create: {
      schoolId: 1,
      school_name: 'Escola Estadual Rui Barbosa',
    },
  });
  console.log(`Escola "${escola.school_name}" garantida.`);

  const ano = await prisma.grade.upsert({
    where: { gradeId: 1 },
    update: {},
    create: {
      gradeId: 1,
      gradeName: '8º Ano',
      schoolId: escola.schoolId, //garante que essa turma está relacionada ao "Rui Barbosa; schoolId=1"
    },
  });
  console.log(`Ano "${ano.gradeName}" garantido.`);

  const turmaA = await prisma.class.upsert({
    where: { classId: 1 },
    update: {},
    create: {
      classId: 1,
      classLetter: 'A',
      gradeId: ano.gradeId,
    },
  });
  console.log(`Turma "${turmaA.classLetter}" garantida.`);

  const turmaB = await prisma.class.upsert({
    where: { classId: 2 },
    update: {},
    create: {
      classId: 2,
      classLetter: 'B',
      gradeId: ano.gradeId, // pertence ao mesmo "8º Ano" da turma A
    },
  });
  console.log(`Turma "${turmaB.classLetter}" garantida.`);


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('senha123', salt);

  const alunosTurmaAData = [
    { name: 'Carlos Andrade', email: 'carlos.a@teste.com', score: 150 },
    { name: 'Beatriz Costa', email: 'beatriz.c@teste.com', score: 180 },
    { name: 'Daniel Ferreira', email: 'daniel.f@teste.com', score: 80 },
    { name: 'Fernanda Lima', email: 'fernanda.l@teste.com', score: 190 },
    { name: 'Gabriel Martins', email: 'gabriel.m@teste.com', score: 120 },
    { name: 'Yago Guirra', email: 'yago.g@teste.com', score: 9999 },
  ];

  for (const aluno of alunosTurmaAData) {
    await prisma.user.upsert({
      where: { email: aluno.email },
      update: {
        name: aluno.name,
        stats: { update: { totalScore: aluno.score } },
      },
      create: {
        name: aluno.name,
        email: aluno.email,
        senha: hashedPassword,
        dataNascimento: new Date('2011-01-01T00:00:00Z'),
        createdAt: new Date(),
        classId: turmaA.classId, // conecta aluno à turma A
        stats: { create: { totalScore: aluno.score } },
      },
    });
  }
  console.log('Alunos da Turma A garantidos.');


  const alunosTurmaBData = [
    { name: 'Helena Souza', email: 'helena.s@teste.com', score: 210 },
    { name: 'Igor Rocha', email: 'igor.r@teste.com', score: 145 },
    { name: 'Juliana Dias', email: 'juliana.d@teste.com', score: 160 },
    { name: 'Lucas Barbosa', email: 'lucas.b@teste.com', score: 110 },
    { name: 'Mariana Nunes', email: 'mariana.n@teste.com', score: 175 },
  ];

  for (const aluno of alunosTurmaBData) {
    await prisma.user.upsert({
      where: { email: aluno.email },
      update: {
        name: aluno.name,
        stats: { update: { totalScore: aluno.score } },
      },
      create: {
        name: aluno.name,
        email: aluno.email,
        senha: hashedPassword,
        dataNascimento: new Date('2011-03-10T00:00:00Z'),
        createdAt: new Date(),
        classId: turmaB.classId, //conecta aluno à turma 
        stats: { create: { totalScore: aluno.score } },
      },
    });
  }

  console.log('Seeding concluído! 🚀');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });