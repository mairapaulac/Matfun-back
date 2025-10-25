import { Request, Response } from 'express';
import rankingService from '../services/rankingService.js';

class RankingController {
  public async getGeneral(_req: Request, res: Response): Promise<Response> {
    try {
        const ranking = await rankingService.getGeneralRanking();
        // retorna status 200 juntamente com os dados
        return res.status(200).json(ranking);
    } catch (error) {
        // caso erro, retorna 500
        console.error('Erro ao buscar ranking geral:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  public async getClass(req:Request, res:Response):Promise<Response>{
    try {
        // pega o classId da url
        const classIdString = req.query.classId as string;
        const classId = parseInt(classIdString, 10);
        
        const ranking = await rankingService.getClassRanking(classId);//busca o ranking usando o classId da url
        return res.status(200).json(ranking); // retorna a listagem de ranking da turma

    } catch (error) {
        console.error('Erro ao buscar ranking por turma:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}

export default new RankingController();