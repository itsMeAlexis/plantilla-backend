import * as bdp_edo_civilServices from "../services/bdp_edo_civil.Services.js";


export const getEdoCivil = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const edo_civiles = await bdp_edo_civilServices.getEdoCivil();
    if (edo_civiles) {
      return res.status(edo_civiles.status).json(edo_civiles);
    }
  } catch (error) {
    next(error);
  }
};