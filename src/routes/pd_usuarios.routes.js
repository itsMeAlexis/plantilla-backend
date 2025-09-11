import { Router } from 'express';
import * as usuariosController from '../controllers/pd_usuarios.Controller.js';

const router = Router();

router.post('/register', usuariosController.createUser);

router.get('/getAll', usuariosController.getAllUsers);

router.get('/getUserById/:IdUsuario', usuariosController.getUserById);

router.put('/updateUser/:IdUsuario', usuariosController.updateUser);

router.patch('/changeUserStatus/:IdUsuario', usuariosController.changeUserStatus);


export default router;