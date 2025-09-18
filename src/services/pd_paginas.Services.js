import Paginas from "../models/pd_paginas.model.js";
import { BITACORA, DATA, OK, AddMSG, FAIL } from '../middleware/respPWA.handler.js';
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';

export const getAllPaginas = async (queryParams = {}) => {
  let bitacora = BITACORA();
  let data = DATA();

  const { start, length, search } = queryParams;

  try {
    bitacora.process = "Obtener todos las páginas.";
    data.method = "GET";
    data.api = "/paginas";
    let queryParams = {};
    let searchMatch = {};

    // Búsqueda
    if (search && search !== "") {
      const searchParts = search.trim().split(/\s+/);

      // Para cada palabra, arma condiciones con Sequelize
      const andConditions = searchParts.map((part) => ({
        [Op.or]: [
          // búsqueda por nombre del rol
          { letra_rol: { [Op.iLike]: `%${part}%` } },
          // búsqueda por descripción del rol
          { descripcion: { [Op.iLike]: `%${part}%` } },
        ],
      }));

      searchMatch = {
        [Op.and]: andConditions,
      };
    }

    queryParams.where = {
      ...searchMatch,
    };

    // Total de registros
    const totalRegistros = await Paginas.count({
      where: searchMatch,
    });

    // Registros paginados
    const paginas = await Paginas.findAll({
      where: searchMatch,
      offset: start,
      limit: length,
      order: [["id_pagina", "DESC"]],
    });

    if (!paginas) {
      data.status = 400;
      data.messageDEV = "No se pudieron obtener las páginas.";
      data.messageUSR = "No se pudieron obtener las páginas.";
      throw Error(data.messageDEV);
    }

    data.process = "Páginas obtenidas correctamente.";
    data.messageDEV = "Se obtuvieron todas las páginas.";
    data.messageUSR = "Se obtuvieron todas las páginas.";
    data.dataRes = { data: paginas, recordsTotal: totalRegistros };

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);
  } catch (error) {
    if (!data.status) data.status = 500;
    if (!data.messageDEV) data.messageDEV = error.message;
    if (!data.messageUSR) data.messageUSR = error.message;
    if (!data.dataRes) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};