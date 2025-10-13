import { Request, Response } from "express";
import { MatchService } from "../services/matchService.js";

const matchService = new MatchService();

export class MatchController {
  async registerMatch(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId; 
      const {
        scoreGained,
        questionsCorrect,
        fractionsQuestions,
        geometryQuestions,
        algebraQuestions,
      } = req.body;

      const match = await matchService.registerMatch({
        userId,
        scoreGained,
        questionsCorrect,
        fractionsQuestions,
        geometryQuestions,
        algebraQuestions,
      });

      return res.status(201).json({
        message: "Partida registrada com sucesso",
        match,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getUserMatches(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const matches = await matchService.getUserMatches(userId);

      return res.json(matches);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
