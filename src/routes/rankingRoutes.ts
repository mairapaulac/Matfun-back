import { Router } from 'express';
import rankingController from '../controllers/rankingController.js';

const rankingRoutes = Router();

// define endpoint
rankingRoutes.get('/ranking/geral', rankingController.getGeneral);
rankingRoutes.get('/ranking/turma', rankingController.getClass);

export default rankingRoutes;