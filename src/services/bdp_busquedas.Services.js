import bdp_busquedas from "../models/bdp_busquedas.model.js";
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

export const getBusquedas = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todas las busquedas.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const busquedas = await bdp_busquedas.findAll();

    if (!busquedas) {
      data.status = 404;
      data.messageDEV = "No se encontraron busquedas.";
      data.messageUSR = "No se encontraron busquedas.";
      throw Error(data.messageDEV);
    }
    // console.log("Busquedas: ", busquedas);
    data.process = "Obtener todas las busquedas.";
    data.messageDEV = "Obtener todas las busquedas.";
    data.messageUSR = "Las busquedas fueron obtenidas Exitosamente.";
    data.dataRes = busquedas;
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