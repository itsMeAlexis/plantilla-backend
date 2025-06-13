import { Router } from 'express';
import * as bdp_cat_nacionalidadesController from '../controllers/bdp_cat_nacionalidades.Controller.js';
import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: 'uploads/user-images/',
//     filename: (req, file, cb) => {
//         const body = req.body;
//         const newFileName = body.Login + body.Nombre + body.Paterno + body.Materno;
//         cb(null, `${newFileName}.jpg`);
//     }
//     });

// const image = multer({ storage });

const router = Router();

// Rutas para las busquedas
router.get('/', bdp_cat_nacionalidadesController.getNacionalidades);



export default router;