import { Router } from 'express';
import * as bdp_reg_victimasController from '../controllers/bdp_reg_victimas.Controller.js';
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
router.get('/', bdp_reg_victimasController.getRegVictimas);

router.get('/countNacional', bdp_reg_victimasController.getCountNacionalRegVictimas);

router.get('/countLocalizadas', bdp_reg_victimasController.getCountLocalizadasRegVictimas);

router.get('/countDesaparecidas', bdp_reg_victimasController.getCountDesaparecidasRegVictimas);

router.get('/desaparecidosMunicipio', bdp_reg_victimasController.getDesaparecidosPorMunicipio);

router.get('/relacionDesaparecidos', bdp_reg_victimasController.getRelacionDesaparecidos);



export default router;