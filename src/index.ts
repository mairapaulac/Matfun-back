import express from "express";
import { prisma } from "../src/prisma/client.js"

const app = express();

app.use(express.json());

//Exemplo
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
