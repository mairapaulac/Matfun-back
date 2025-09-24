//O client.ts é o objeto que vai conectar a aplicação com o banco de dados e é gerado automaticamente pelo prisma a partir do schema.prisma
//instanciado apenas uma vez e compartilhado entre os repositories.

import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();