import bdp_colectivos from "../models/bdp_colectivos.model.js";
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

export const getColectivos = async (query) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { start, length } = query;
  try {
    bitacora.process = "Obtener todos los colectivos.";
    data.method = "GET";
    data.api = "/";
    const totalRegistros = await bdp_colectivos.count();
    //Obtener todas las busquedas usando sequelize
    const colectivos = await bdp_colectivos.findAll({
      offset: start,
      limit: length
    });

    if (!colectivos) {
      data.status = 404;
      data.messageDEV = "No se encontraron colectivos.";
      data.messageUSR = "No se encontraron colectivos.";
      throw Error(data.messageDEV);
    }
    // console.log("colectivos: ", colectivos);
    data.process = "Obtener todos los colectivos.";
    data.messageDEV = "Obtener todos los colectivos.";
    data.messageUSR = "Los colectivos fueron encontrados Exitosamente.";
    data.dataRes = {data:colectivos, recordsTotal: totalRegistros};
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