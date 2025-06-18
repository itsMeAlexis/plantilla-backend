import bdp_prereg_victimas from "../models/bdp_prereg_victimas.model.js";
import { authToken } from "./auth.Services.js";
import {
  BITACORA,
  DATA,
  OK,
  AddMSG,
  FAIL,
} from "../middleware/respPWA.handler.js";
import dayjs from 'dayjs';
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Op, Sequelize } from 'sequelize';


export const getPreregVictimas = async () => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todos los preregistros.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const preregistros = await bdp_prereg_victimas.findAll();

    if (!preregistros) {
      data.status = 404;
      data.messageDEV = "No se encontraron preregistros.";
      data.messageUSR = "No se encontraron preregistros.";
      throw Error(data.messageDEV);
    }
    // console.log("preregistros: ", preregistros);
    data.process = "Obtener todos los preregistros.";
    data.messageDEV = "Obtener todos los preregistros.";
    data.messageUSR = "Los preregistros fueron obtenidos Exitosamente.";
    data.dataRes = preregistros;
    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = message;
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};

export const createPreregVictimas = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Registrar un nuevo preregistro.";
    data.method = "POST";
    data.api = "/";
    console.log("body: ", body);
    //Asignar el usuario al body
    //const token = token
    //decodificar el token
    // const decoded = jwt.verify(token, config.JWT_SECRET);
    // body.usr_registro = decoded.username;
    //Fecha de registro
    const ahoraEnMazatlan = dayjs().tz('America/Mazatlan');
    // Es mejor usar un formato estándar y ordenable (ISO 8601)
    body.fecha_registro = ahoraEnMazatlan.format('YYYY-MM-DD HH:mm:ss');

    body.fecha_hechos = dayjs(body.fecha_hechos).tz('America/Mazatlan').format('YYYY-MM-DD HH:mm:ss');

    const preregistro = await bdp_prereg_victimas.create(body);
    console.log("preregistro: ", preregistro);
    if (!preregistro) {
      data.status = 400;
      data.messageDEV = "Error al registrar preregistro.";
      data.messageUSR = "Error al registrar preregistro.";
      throw Error(data.messageDEV);
    }
    data.process = "Registrar un nuevo preregistro.";
    data.messageDEV = "Se creo el preregistro con exito.";
    data.messageUSR = "Se creo el preregistro con exito.";
    data.dataRes = preregistro;
    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = message;
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};