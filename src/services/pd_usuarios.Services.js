import Usuarios from "../models/pd_usuarios.model.js";
import Roles from "../models/pd_roles.model.js";
import { BITACORA, DATA, OK, AddMSG, FAIL } from '../middleware/respPWA.handler.js';
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';

export const createUser = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
      bitacora.process = "Registrar un nuevo usuario.";
      data.method = "POST";
      data.api = "/";

      const user = await Usuarios.create(body);
      if (!user) {
          data.status = 400;
          data.messageDEV = "Error al registrar usuario.";
          data.messageUSR = "Error al registrar usuario.";
          throw Error(data.messageDEV);
      }

      data.process = "Registrar un nuevo usuario.";
      data.messageDEV = "Se creo el usuario con exito.";
      data.messageUSR = "Se creo el usuario con exito.";
      data.dataRes = {user};
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