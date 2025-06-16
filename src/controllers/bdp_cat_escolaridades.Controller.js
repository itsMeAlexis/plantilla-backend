import * as bdp_cat_escolaridadesServices from "../services/bdp_cat_escolaridades.Services.js";


export const getEscolaridades = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const escolaridades = await bdp_cat_escolaridadesServices.getEscolaridades();
    if (escolaridades) {
      return res.status(escolaridades.status).json(escolaridades);
    }
  } catch (error) {
    next(error);
  }
};