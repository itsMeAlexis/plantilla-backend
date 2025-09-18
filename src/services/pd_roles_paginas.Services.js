import { pd_paginas, pd_roles_paginas, pd_roles } from '../models/associations.js'
import { BITACORA, DATA, OK, AddMSG, FAIL } from '../middleware/respPWA.handler.js';
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';

export const getAllRolesPaginasByIdRol = async (idRol, queryParams = {}) => {
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
      id_rol_rp: Number(idRol) || 0,
    };

    // Total de registros
    const totalRegistros = await pd_roles_paginas.count({
      ...queryParams,
    });

    queryParams.offset = start ? parseInt(start) : 0;
    queryParams.limit = length ? parseInt(length) : 10000;
    queryParams.order = [["id_rol_rp", "ASC"]];
    // Registros paginados
    const paginas = await pd_roles_paginas.findAll({
      ...queryParams,
      include:[{
        model: pd_paginas,
        as: 'PD_PAGINA',
      }]
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

export const updateRolesPaginas = async (idRol, body) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { paginasToAdd = [], paginasToRemove = [] } = body;
  
  // Inicializar transacción
  let transaction = null;
  
  try {
    bitacora.process = "Actualizar páginas del rol.";
    data.method = "PUT";
    data.api = "/roles-paginas/:id";
    delete body.id_rol;
    data.body = { idRol, ...body };
    
    // Verificar que el rol exista
    const rol = await pd_roles.findOne({ where: { id_rol: Number(idRol) } });
    if (!rol) {
      data.status = 404;
      data.messageDEV = "Rol no encontrado.";
      data.messageUSR = "Rol no encontrado.";
      throw Error(data.messageDEV);
    }

    // Iniciar transacción
    transaction = await pd_roles_paginas.sequelize.transaction();

    // Actualizar información del rol dentro de la transacción
    await pd_roles.update(
      {
        descripcion: body.descripcion || rol.descripcion,
        letra_rol: body.letra_rol || rol.letra_rol,
      },
      {
        where: { id_rol: Number(idRol) },
        transaction, // Usar la transacción
      }
    );

    // Agregar nuevas páginas al rol
    if (paginasToAdd.length !== 0) {
      const nuevasPaginas = paginasToAdd.map((pagina) => ({
        id_rol_rp: Number(idRol),
        id_pagina_rp: pagina.id_pagina,
      }));
      
      await pd_roles_paginas.bulkCreate(nuevasPaginas, {
        transaction, // Usar la transacción
      });
    }

    // Eliminar páginas del rol
    if (paginasToRemove.length !== 0) {
      const paginasIdsToRemove = paginasToRemove.map((pagina) => pagina.id_pagina);
      
      await pd_roles_paginas.destroy({
        where: {
          id_rol_rp: Number(idRol),
          id_pagina_rp: {
            [Op.in]: paginasIdsToRemove,
          },
        },
        transaction, // Usar la transacción
      });
    }

    // Si llegamos aquí, todas las operaciones fueron exitosas
    await transaction.commit();
    
    data.process = "Páginas del rol actualizadas correctamente.";
    data.messageDEV = "Se actualizaron las páginas del rol exitosamente.";
    data.messageUSR = "Se actualizaron las páginas del rol exitosamente.";
    data.dataRes = { idRol, paginasAdded: paginasToAdd.length, paginasRemoved: paginasToRemove.length };

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);
    
  } catch (error) {
    // Si hay un error, hacer rollback de la transacción
    if (transaction) {
      await transaction.rollback();
    }
    if (!data.status) data.status = 500;
    if (!data.messageDEV) data.messageDEV = error.message;
    if (!data.messageUSR) data.messageUSR = error.message;
    if (!data.dataRes) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
}

export const createRolesPaginas = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { paginasToAdd = [] } = body;

  // Inicializar transacción
  let transaction = null;

  try {
    bitacora.process = "Crear nuevas páginas para el rol.";
    data.method = "POST";
    data.api = "/roles-paginas";
    delete body.id_rol;
    data.body = {...body };

    // Verificar que el rol no exista con letra_rol
    const rol = await pd_roles.findOne({ where: { letra_rol: body.letra_rol } });
    if (rol) {
      data.status = 404;
      data.messageDEV = "Identificador del rol ya existe.";
      data.messageUSR = "Identificador del rol ya existe.";
      throw Error(data.messageDEV);
    }

    // Iniciar transacción
    transaction = await pd_roles.sequelize.transaction();

    // Crear el nuevo rol dentro de la transacción
    const nuevoRol = await pd_roles.create({
      letra_rol: body.letra_rol,
      descripcion: body.descripcion,
    }, {
      transaction, // Usar la transacción
    });

    // Crear nuevas asociaciones de páginas solo si hay páginas para agregar
    if (paginasToAdd.length > 0) {
      const nuevasPaginas = paginasToAdd.map((pagina) => ({
        id_rol_rp: Number(nuevoRol.id_rol),
        id_pagina_rp: pagina.id_pagina,
      }));

      await pd_roles_paginas.bulkCreate(nuevasPaginas, {
        transaction, // Usar la transacción
      });
    }

    // Si llegamos aquí, todas las operaciones fueron exitosas
    await transaction.commit();

    data.process = "Nuevas páginas creadas correctamente.";
    data.messageDEV = "Se crearon nuevas páginas para el rol exitosamente.";
    data.messageUSR = "Se crearon nuevas páginas para el rol exitosamente.";
    data.dataRes = { 
      idRol: nuevoRol.id_rol, 
      letra_rol: nuevoRol.letra_rol,
      descripcion: nuevoRol.descripcion,
      paginasAdded: paginasToAdd.length 
    };

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);
    
  } catch (error) {
    // Si hay un error, hacer rollback de la transacción
    if (transaction) {
      await transaction.rollback();
    }
    
    if (!data.status) data.status = 500;
    if (!data.messageDEV) data.messageDEV = error.message;
    if (!data.messageUSR) data.messageUSR = error.message;
    if (!data.dataRes) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
}