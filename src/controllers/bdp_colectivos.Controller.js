import * as bdp_colectivosServices from "../services/bdp_colectivos.Services.js";


export const getColectivos = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const query = req.query;
    const colectivos = await bdp_colectivosServices.getColectivos(query);
    if (colectivos) {
      return res.status(colectivos.status).json(colectivos);
    }
  } catch (error) {
    next(error);
  }
};