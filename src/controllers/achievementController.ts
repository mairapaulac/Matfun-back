import { Request, Response } from "express";
import { AchievementService } from "../services/achievementService.js";


const achievementService = new AchievementService();

export class AchievementController {

    async getAllAchievements(_req:Request,res: Response) {
        try {
            const achievements = await achievementService.getAllAchievements();
            return res.status(200).json(achievements);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getUserAchievements(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const userAchievements = await achievementService.getUserAchievements(userId);
            return res.status(200).json(userAchievements);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getAchievementsWithProgress(req: Request, res: Response) {
        try {
            
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: "userId is required in the query parameters." });
            }

            const achievements = await achievementService.getAchievementsWithProgress(Number(userId));
            return res.status(200).json(achievements);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

}