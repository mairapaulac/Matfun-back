import { Router } from 'express';
import rankingController from '../controllers/rankingController.js';

const rankingRoutes = Router();

// define endpoint
rankingRoutes.get('/rank/geral', rankingController.getGeneral);
rankingRoutes.get('/rank/turma', rankingController.getClass);
export default rankingRoutes;