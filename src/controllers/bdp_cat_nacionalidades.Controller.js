import * as bdp_cat_nacionalidadesServices from "../services/bdp_cat_nacionalidades.Services.js";


export const getNacionalidades = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const nacionalidades = await bdp_cat_nacionalidadesServices.getNacionalidades();
    if (nacionalidades) {
      return res.status(nacionalidades.status).json(nacionalidades);
    }
  } catch (error) {
    next(error);
  }
};