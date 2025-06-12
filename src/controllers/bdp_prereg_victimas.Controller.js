import * as bdp_prereg_victimasServices from "../services/bdp_prereg_victimas.Services.js";


export const getPreregVictimas = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const preregistro = await bdp_prereg_victimasServices.getPreregVictimas();
    if (preregistro) {
      return res.status(preregistro.status).json(preregistro);
    }
  } catch (error) {
    next(error);
  }
};

export const createPreregVictimas = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    //leer el body
    const body = req.body;
    const preregistro = await bdp_prereg_victimasServices.createPreregVictimas(body);
    if (preregistro) {
      return res.status(preregistro.status).json(preregistro);
    }
  } catch (error) {
    next(error);
  }
};