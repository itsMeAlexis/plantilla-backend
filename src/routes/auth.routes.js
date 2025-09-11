import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);


// router.put('/change-password', authController.changePassword);

// router.put('/forgot-password-change/', authController.recoverPassword);

// //GRX: para intentar resetear la contraseña si hay correo
// router.put('/reset-password/:IdUsuario', authController.resetPassword);
// //GRX: para enviar un correo con la contraseña resetada al usuario
// router.put('/send-email-password/', authController.sendEmailPassword);

// router.get('/version/', authController.returnServerVersion);

export default router;