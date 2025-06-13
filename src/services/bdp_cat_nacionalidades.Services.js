import bdp_cat_nacionalidades from "../models/bdp_cat_nacionalidades.model.js";
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

export const getNacionalidades = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todas las nacionalidades.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const nacionalidades = await bdp_cat_nacionalidades.findAll();

    if (!nacionalidades) {
      data.status = 404;
      data.messageDEV = "No se encontraron nacionalidades.";
      data.messageUSR = "No se encontraron nacionalidades.";
      throw Error(data.messageDEV);
    }
    // console.log("Busquedas: ", busquedas);
    data.process = "Obtener todas las nacionalidades.";
    data.messageDEV = "Obtener todas las nacionalidades.";
    data.messageUSR = "Las busquedas fueron nacionalidades Exitosamente.";
    data.dataRes = nacionalidades;
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