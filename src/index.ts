//O index.ts serve como ponto de entrada para organizar e expor o código dentro de uma pasta ou módulo, permitindo agrupar
// e simplificar a importação de funcionalidades relacionadas.

import express from "express";
import { prisma } from "../src/prisma/client.js"

const app = express();

app.use(express.json());

//Exemplo
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
