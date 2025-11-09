import { Router } from 'express';
import rankingController from '../controllers/rankingController.js';

const rankingRoutes = Router();

// define endpoint
rankingRoutes.get('/geral', rankingController.getGeneral);
rankingRoutes.get('/turma', rankingController.getClass);  ///ranking/turma?classId=1  - proteger esta rota depois    

export default rankingRoutes;