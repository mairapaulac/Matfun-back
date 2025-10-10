import { Request, Response } from "express";
import { UserService } from "../services/userService.js";

const userService = new UserService();

export class UserController {
  async getAll(res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  async getById(req: Request, res: Response) {

    try {
      const userId = Number(req.params.id);
      const user = await userService.getUserById(userId);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, senha, dataNascimento, classId } = req.body;
      const user = await userService.createUser({
        name,
        email,
        senha,
        dataNascimento: new Date(dataNascimento),
        classId: Number(classId),
      });
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await userService.getUserById(userId);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
  }
}
