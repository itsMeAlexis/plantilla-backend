import { Router } from 'express';
import * as bdp_colectivosController from '../controllers/bdp_colectivos.Controller.js';
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
router.get('/', bdp_colectivosController.getColectivos);



export default router;