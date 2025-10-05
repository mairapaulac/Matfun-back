import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o script de seed...');

  // "upsert" tenta encontrar um registro. Se não encontrar, ele cria.
  // assim vc pode rodar o script varias vezes

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

  const turma = await prisma.class.upsert({
    where: { classId: 1 },
    update: {},
    create: {
      classId: 1,
      classLetter: 'A',
      gradeId: ano.gradeId, // garante que a turma(class) A, é a turma A do 8º ano... 
    },
  });
  console.log(`Turma "${turma.classLetter}" garantida.`);



  // criando senha padrao com hash para todos alunos
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('senha123', salt);

  const alunosData = [
    { name: 'Carlos Andrade', email: 'carlos.a@teste.com' },
    { name: 'Beatriz Costa', email: 'beatriz.c@teste.com' },
    { name: 'Daniel Ferreira', email: 'daniel.f@teste.com' },
    { name: 'Fernanda Lima', email: 'fernanda.l@teste.com' },
    { name: 'Gabriel Martins', email: 'gabriel.m@teste.com' },
  ];

  console.log(`Criando ${alunosData.length} alunos na Turma ${ano.gradeName} ${turma.classLetter}...`);

  // inserir alunos no banco
  for (const aluno of alunosData) {
    //upsert para evitar erro de email duplicado
    await prisma.user.upsert({
      where: { email: aluno.email },
      update: {}, // se o aluno já existir, não faz nada
      create: {
        name: aluno.name,
        email: aluno.email,
        senha: hashedPassword,
        dataNascimento: new Date('2011-01-01T00:00:00Z'), // data de nascimento de exemplo
        createdAt: new Date(),
        classId: turma.classId, // conecta o aluno à turma "A"
        // cria a linha de estatísticas obrigatória para o novo aluno
        stats: {
          create: {}, // cria um UserStats com todos os valores padrão (0)
        },
      },
    });
  }

  console.log('Alunos criados com sucesso!');
  console.log('Seeding concluído! 🚀');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // garante que a conexão com o banco seja fechada
    await prisma.$disconnect();
  });