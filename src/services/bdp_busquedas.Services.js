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

export const getBusquedas = async (query) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { start, length } = query;
  try {
    bitacora.process = "Obtener todas las busquedas.";
    data.method = "GET";
    data.api = "/";
    const totalRegistros = await bdp_busquedas.count();
    //Obtener todas las busquedas usando sequelize
    const busquedas = await bdp_busquedas.findAll(
      {
        offset: start,
        limit: length
      }
    );

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
    data.dataRes = { data: busquedas , recordsTotal: totalRegistros };
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