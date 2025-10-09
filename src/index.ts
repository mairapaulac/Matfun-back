//O index.ts serve como ponto de entrada para organizar e expor o código dentro de uma pasta ou módulo, permitindo agrupar
// e simplificar a importação de funcionalidades relacionadas.

import express from "express";
import dotenv from "dotenv";
import authRoutes from "../src/auth/authRoutes.js"

dotenv.config();
const app = express();
app.use(express.json());

app.use(authRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
})