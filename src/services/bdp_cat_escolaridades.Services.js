import bdp_cat_escolaridades from "../models/bdp_cat_escolaridades.model.js";
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

export const getEscolaridades = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todas las escolaridades.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const escolaridades = await bdp_cat_escolaridades.findAll();

    if (!escolaridades) {
      data.status = 404;
      data.messageDEV = "No se encontraron escolaridades.";
      data.messageUSR = "No se encontraron escolaridades.";
      throw Error(data.messageDEV);
    }
    // console.log("escolaridades: ", escolaridades);
    data.process = "Obtener todas las escolaridades.";
    data.messageDEV = "Obtener todas las escolaridades.";
    data.messageUSR = "Las escolaridades fueron encontrados Exitosamente.";
    data.dataRes = escolaridades;
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