import { Router } from 'express';
import * as usuariosController from '../controllers/pd_usuarios.Controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/register', authenticate, usuariosController.createUser);

export default router;