import { Router } from 'express';
import * as paginasController from '../controllers/pd_paginas.Controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, paginasController.getAllPaginas);

export default router;