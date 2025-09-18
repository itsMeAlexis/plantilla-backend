import { Router } from 'express';
import * as roles_paginasController from '../controllers/pd_roles_paginas.Controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.get('/:id', authenticate, roles_paginasController.getAllRolesPaginasByIdRol);

router.post('/', authenticate, roles_paginasController.createRolesPaginas);

router.put('/:id', authenticate, roles_paginasController.updateRolesPaginas);

export default router;