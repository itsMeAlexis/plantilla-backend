import { Router } from 'express';
import * as usuariosController from '../controllers/pd_usuarios.Controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/register', authenticate, usuariosController.createUser);

router.get('/', usuariosController.getAllUsers);

router.get('/getUserById/:IdUsuario', usuariosController.getUserById);

router.put('/:IdUsuario', usuariosController.updateUser);

router.put('/updateProfile/', authenticate, usuariosController.updateProfile);

router.patch('/changeUserStatus/:IdUsuario', usuariosController.changeUserStatus);


export default router;