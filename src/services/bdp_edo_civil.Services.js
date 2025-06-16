import bdp_edo_civil from "../models/bdp_edo_civil.model.js";
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

export const getEdoCivil = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todos los estados civiles.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const edo_civiles = await bdp_edo_civil.findAll();

    if (!edo_civiles) {
      data.status = 404;
      data.messageDEV = "No se encontraron estados civiles.";
      data.messageUSR = "No se encontraron estados civiles.";
      throw Error(data.messageDEV);
    }
    // console.log("edo_civiles: ", edo_civiles);
    data.process = "Obtener todos los estados civiles.";
    data.messageDEV = "Obtener todos los estados civiles.";
    data.messageUSR = "Los estados civiles fueron encontrados Exitosamente.";
    data.dataRes = edo_civiles;
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