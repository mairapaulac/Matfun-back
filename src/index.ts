//O index.ts serve como ponto de entrada para organizar e expor o código dentro de uma pasta ou módulo, permitindo agrupar
// e simplificar a importação de funcionalidades relacionadas.

import express from "express";
import dotenv from "dotenv";
// import rankingRoutes from "./routes/rankingRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import supportRoutes from "./routes/supportRoutes.js"
import matchRoutes from "./routes/matchRoutes.js";
import authRoutes from "./auth/authRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/ranking", rankingRoutes)
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/achievements", achievementRoutes);
app.use("/matches", matchRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/support", supportRoutes)

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
})