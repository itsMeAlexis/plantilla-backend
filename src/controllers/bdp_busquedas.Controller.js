import * as bdp_busquedasServices from "../services/bdp_busquedas.Services.js";


export const getBusquedas = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const query = req.query;
    const busquedas = await bdp_busquedasServices.getBusquedas(query);
    if (busquedas) {
      return res.status(busquedas.status).json(busquedas);
    }
  } catch (error) {
    next(error);
  }
};