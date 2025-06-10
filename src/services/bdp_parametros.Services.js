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
    const parametrosJSON = JSON.parse(JSON.stringify(parametros));
    const transformarParametros = (arrayDeParametros) => {
      // Definimos el estado inicial de nuestro objeto resultado.
      const estadoInicial = {
        periodo: 'N/A',
        fecha: 'N/A',
        cantidad: 0,
      };

      // Usamos .reduce() para iterar sobre el array y construir el objeto.
      // 'acumulador' es el objeto que estamos construyendo.
      // 'parametroActual' es el elemento del array en la iteración actual.
      return arrayDeParametros.reduce((acumulador, parametroActual) => {
        switch (parametroActual.id_parametro) {
          case 4:
            acumulador.periodo = parametroActual.texto;
            break;
          case 5:
            acumulador.fecha = parametroActual.texto;
            break;
          case 6:
            acumulador.cantidad = parametroActual.cantidad.toLocaleString('es-MX');
            break;
          default:
            // No hacer nada para otros parámetros no deseados.
            break;
        }
        // Es crucial devolver el acumulador en cada iteración.
        return acumulador;
      }, estadoInicial); // Le pasamos el estado inicial al reduce.
    };

    // --- Ejemplo de uso ---
    const resultadoTransformado = transformarParametros(parametrosJSON);
    // console.log("resultadoTransformado: ", resultadoTransformado);
    data.process = "Obtener todos los parametros.";
    data.messageDEV = "Obtener todos los parametros.";
    data.messageUSR = "Los parametros fueron obtenidos Exitosamente.";
    data.dataRes = resultadoTransformado;
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