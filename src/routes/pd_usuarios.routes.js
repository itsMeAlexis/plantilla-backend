import { Router } from 'express';
import * as usuariosController from '../controllers/pd_usuarios.Controller.js';

const router = Router();

router.post('/register', usuariosController.createUser);

export default router;