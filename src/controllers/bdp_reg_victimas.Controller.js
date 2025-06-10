import * as bdp_reg_victimasServices from "../services/bdp_reg_victimas.Services.js";


export const getRegVictimas = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const busquedas = await bdp_reg_victimasServices.getRegVictimas();
    if (busquedas) {
      return res.status(busquedas.status).json(busquedas);
    }
  } catch (error) {
    next(error);
  }
};

export const getCountNacionalRegVictimas = async (req, res, next) => {
  try {
    //leer el token
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "No se proporcionó un token",
    //   });
    // }
    const filtros = req.query;
    const busquedas = await bdp_reg_victimasServices.getCountNacionalRegVictimas(filtros);
    if (busquedas) {
      return res.status(busquedas.status).json(busquedas);
    }
  } catch (error) {
    next(error);
  }
}