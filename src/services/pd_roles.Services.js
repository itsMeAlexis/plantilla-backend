import { pd_roles } from "../models/associations.js";
import { BITACORA, DATA, OK, AddMSG, FAIL } from '../middleware/respPWA.handler.js';
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sequelize from "../config/database.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';

export const getAllRoles = async (queryParams = {}) => {
  let bitacora = BITACORA();
  let data = DATA();

  const { start, length, search } = queryParams;

  try {
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
    const totalRegistros = await pd_roles.count({
      where: searchMatch,
    });

    // Registros paginados
    const roles = await pd_roles.findAll({
      where: searchMatch,
      offset: start,
      limit: length,
      order: [["id_rol", "DESC"]],
    });

    bitacora.process = "Obtener todos los roles.";
    data.method = "GET";
    data.api = "/roles";

    if (!roles) {
      data.status = 400;
      data.messageDEV = "No se pudieron obtener los roles.";
      data.messageUSR = "No se pudieron obtener los roles.";
      throw Error(data.messageDEV);
    }

    data.process = "Roles obtenidos correctamente.";
    data.messageDEV = "Se obtuvieron todos los roles.";
    data.messageUSR = "Se obtuvieron todos los roles.";
    data.dataRes = { data: roles, recordsTotal: totalRegistros };

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

export const getAllRolesWithAdditionalInfo = async (token, queryParams = {}) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { start, length, search } = queryParams;
  try {
    bitacora.process = "Obtener todos los roles con información adicional.";
    data.method = "GET";
    data.api = "/roles/with-aditional-info";
    const user = jwt.verify(token, config.JWT_SECRET_KEY);
    console.log(user)
    let queryParams = {};
    let searchMatch = {};
    //Busqueda
    if (search && search !== "") {
      const searchParts = search.trim().split(/\s+/);
      // Para cada palabra, busca en los campos indicados
      const andConditions = searchParts.map(part => ({
        [Op.or]: [
          // { NombreCompleto: { [Op.iLike]: `%${part}%` } },
          { letra_rol: { [Op.iLike]: `%${part}%` } },
          { descripcion: { [Op.iLike]: `%${part}%` } }
        ]
      }));

      // El where final
      searchMatch = {
        [Op.and]: andConditions
      };
    }
    queryParams.where = {
      ...searchMatch,
      ...(user.rol === "R" ?
        {}
        :
        { tipo_rol: { [Op.ne]: "R" } })
    };
    const rolesCount = await pd_roles.count({
      ...queryParams,
    });
    queryParams.offset = start;
    queryParams.limit = length;
    queryParams.order = [["id_rol", "ASC"]];
    // Por ejemplo, podrías hacer joins con otras tablas o agregar cálculos adicionales.
    const roles = await pd_roles.findAll({
      ...queryParams,
    });
    if (!roles) {
      data.status = 400;
      data.messageDEV = "No se pudieron obtener los roles con información adicional.";
      data.messageUSR = "No se pudieron obtener los roles con información adicional.";
      throw Error(data.messageDEV);
    }
    // Tu conteo con SQL puro
    const conteoQuery = `
      SELECT r."ID_ROL", COUNT(*) as total_usuarios
      FROM public."PD_ROLES" r
      INNER JOIN public."PD_USUARIOS" u
        ON u."ID_ROL" = r."ID_ROL"
      GROUP BY r."ID_ROL"
    `;

    const conteoRoles = await sequelize.query(conteoQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    //Contar el total de paginas asignadas
    const conteoQuery2 = `
    SELECT r."ID_ROL", COUNT(*) as total_paginas
    FROM public."PD_ROLES_PAGINAS" rp
    INNER JOIN public."PD_ROLES" r
      ON r."ID_ROL" = rp."ID_ROL"
    GROUP BY r."ID_ROL"
    `;

    const conteoRoles2 = await sequelize.query(conteoQuery2, {
      type: sequelize.QueryTypes.SELECT
    });

    const rolesConConteo = roles.map(rol => ({
      ...rol.toJSON(),
      total_paginas: conteoRoles2.find(c => c.ID_ROL === rol.id_rol)?.total_paginas || 0,
      total_usuarios: conteoRoles.find(c => c.ID_ROL === rol.id_rol)?.total_usuarios || 0
    }))

    data.process = "Roles obtenidos correctamente.";
    data.messageDEV = "Se obtuvieron todos los roles con información adicional.";
    data.messageUSR = "Se obtuvieron todos los roles con información adicional.";
    data.dataRes = { data: rolesConConteo, recordsTotal: rolesCount };

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