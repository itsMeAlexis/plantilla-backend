import * as bdp_parametrosServices from "../services/bdp_parametros.Services.js";


export const getParametros = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const busquedas = await bdp_parametrosServices.getParametros();
    if (busquedas) {
      return res.status(busquedas.status).json(busquedas);
    }
  } catch (error) {
    next(error);
  }
};