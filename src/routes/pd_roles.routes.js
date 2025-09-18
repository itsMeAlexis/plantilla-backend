import { Router } from 'express';
import * as usuariosController from '../controllers/pd_roles.Controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.get('/', usuariosController.getAllRoles);

router.get('/with-aditional-info', usuariosController.getAllRolesWithAdditionalInfo);

export default router;