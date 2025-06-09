import bdp_parametros from "../models/bdp_parametros.model.js";
import { authToken } from "./auth.Services.js";
import {
  BITACORA,
  DATA,
  OK,
  AddMSG,
  FAIL,
} from "../middleware/respPWA.handler.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';
import { fileURLToPath } from 'url';

export const getParametros = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todos los parametros.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const parametros = await bdp_parametros.findAll();

    if (!parametros) {
      data.status = 404;
      data.messageDEV = "No se encontraron parametros.";
      data.messageUSR = "No se encontraron parametros.";
      throw Error(data.messageDEV);
    }
    // console.log("parametros: ", parametros);
    data.process = "Obtener todos los parametros.";
    data.messageDEV = "Obtener todos los parametros.";
    data.messageUSR = "Los parametros fueron obtenidos Exitosamente.";
    data.dataRes = parametros;
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