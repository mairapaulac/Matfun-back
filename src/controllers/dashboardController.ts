import { Request, Response } from "express";
import { DashboardService } from "../services/dashboardService.js";

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboard(req: Request, res: Response) {
    try {

     const userId = (req as any).user.userId;// vem do middleware de autenticação

      if (!userId) 
        return res.status(401).json({ error: "Usuário não autenticado" });
    
      const dashboardData = await dashboardService.getDashboardData(userId);
      return res.status(200).json(dashboardData);

    } catch (error: any) {

      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}
