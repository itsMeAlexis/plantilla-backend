import bdp_reg_victimas from "../models/bdp_reg_victimas.model.js";
import bdp_parametros from "../models/bdp_parametros.model.js";
import bdp_cat_mun from "../models/bdp_cat_mun.model.js";
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
import { Op, Sequelize } from 'sequelize';

export const getRegVictimas = async () => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todos los parametros.";
    data.method = "GET";
    data.api = "/";
    //Obtener todas las busquedas usando sequelize
    const parametros = await bdp_reg_victimas.findAll();

    if (!parametros) {
      data.status = 404;
      data.messageDEV = "No se encontraron parametros.";
      data.messageUSR = "No se encontraron parametros.";
      throw Error(data.messageDEV);
    }
    // console.log("parametros: ", parametros);
    data.process = "Obtener todos los parametros.";
    data.messageDEV = "Obtener todos los parametros.";
    data.messageUSR = "Los parametros fueron obtenidos Exitosamente.";
    data.dataRes = parametros;
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
export const getCountNacionalRegVictimas = async (filtros) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener conteo de registros.";
    data.method = "GET";
    data.api = "/";
    // 1. Construir la cláusula 'where' dinámicamente
    // Esto replica la lógica de '(columna = :PARAM or :PARAM is null)'
    const whereClause = {};
    whereClause.municipio_hechos = filtros.municipio ? filtros.municipio: null;
    whereClause.localidad_hechos = filtros.localidad ? filtros.localidad: null;
    whereClause.sexo_victima = filtros.sexo ? filtros.sexo: null;
    
    // 2. Ejecutar la consulta de conteo con la cláusula 'where'
    // Usamos .count() en lugar de .findAll() porque es mucho más eficiente
    // para obtener solo el número total de registros que coinciden.
    const totalCoincidencias = await bdp_reg_victimas.count({
      // where: whereClause
    });
    
    
    console.log("totalCoincidencias: ", totalCoincidencias);
    if (!totalCoincidencias) {
      data.status = 404;
      data.messageDEV = "No se encontraron registros.";
      data.messageUSR = "No se encontraron registros.";
      throw Error(data.messageDEV);
    }

    const ParametroTotalVicPais = await bdp_parametros.findAll({
      attributes: ['cantidad'],
      where: {
        tema: 'tot_vic_fed',
      }
    })
    // console.log("ParametroTotalVicPais: ", ParametroTotalVicPais[0].cantidad);
    if (!ParametroTotalVicPais) {
      data.status = 404;
      data.messageDEV = "No se encontraron parametros de total de victimas a nivel nacional.";
      data.messageUSR = "No se encontraron parametros de total de victimas a nivel nacional.";
      throw Error(data.messageDEV);
    }
    const totalVicPais = ParametroTotalVicPais[0].cantidad;
    // 3. Realizar los cálculos y el formato en JavaScript
    // Esto es más limpio y mantenible que hacerlo directamente en la consulta SQL con Sequelize.

    let porcentaje = 0;
    const calculo = (totalCoincidencias / totalVicPais) * 100; // Porcentaje base, se puede ajustar según la lógica de negocio.
    porcentaje = Number((calculo + Number.EPSILON).toFixed(2));

    // 4. Formatear el objeto de respuesta final, tal como lo hacía tu consulta SQL.
    const resultado = {
      titulo: 'Total de personas desaparecidas y localizadas en Nayarit',
      // toLocaleString('es-MX') formatea el número con comas, similar a '999G999...'
      cuenta: totalCoincidencias.toLocaleString('es-MX'),
      porcentaje: porcentaje
    };
    // console.log("resultado: ", resultado);
    data.process = "Obtener todos los registros.";
    data.messageDEV = "Obtener todos los registros.";
    data.messageUSR = "Los registros fueron obtenidos Exitosamente.";
    data.dataRes = resultado;
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

export const getCountLocalizadasRegVictimas = async (filtros) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener conteo de registros localizados.";
    data.method = "GET";
    data.api = "/";
    // 1. Construir la cláusula 'where' dinámicamente
    // Esto replica la lógica de '(columna = :PARAM or :PARAM is null)'
    const whereClause = {};
    whereClause.municipio_hechos = filtros.municipio ? filtros.municipio: null;
    whereClause.localidad_hechos = filtros.localidad ? filtros.localidad: null;
    whereClause.sexo_victima = filtros.sexo ? filtros.sexo: null;
    
    // 2. Ejecutar la consulta de conteo con la cláusula 'where'
    // Usamos .count() en lugar de .findAll() porque es mucho más eficiente
    // para obtener solo el número total de registros que coinciden.
    const totalCoincidencias = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'LOCALIZADA%'
        }
      }
    });
    const totalConVida = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'LOCALIZADA CON%'
        },
      }
    });
    
    const totalSinVida = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'LOCALIZADA SIN%'
        },
      }
    });

    const totalHombresLocalizados = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'LOCALIZADA%'
        },
        sexo_victima: {
          [Op.like]: 'H%'
        }
      }
    });
    
    const totalMujeresLocalizadas = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'LOCALIZADA%'
        },
        sexo_victima: {
          [Op.like]: 'M%'
        }
      }
    });

    console.log("totalCoincidencias: ", totalCoincidencias);
    if (!totalCoincidencias) {
      data.status = 404;
      data.messageDEV = "No se encontraron registros localizados.";
      data.messageUSR = "No se encontraron registros localizados.";
      throw Error(data.messageDEV);
    }

    const totalVicEstado = await bdp_reg_victimas.count({
    })
    console.log("totalVicEstado: ", totalVicEstado);
    if (!totalVicEstado) {
      data.status = 404;
      data.messageDEV = "No se encontraron parametros de total de victimas a nivel estatal.";
      data.messageUSR = "No se encontraron parametros de total de victimas a nivel estatal.";
      throw Error(data.messageDEV);
    }
    // 3. Realizar los cálculos y el formato en JavaScript
    // Esto es más limpio y mantenible que hacerlo directamente en la consulta SQL con Sequelize.

    let porcentaje = 0;
    const calculo = (totalCoincidencias /
      totalVicEstado) * 100; // Porcentaje base, se puede ajustar según la lógica de negocio.
    porcentaje = Number((calculo + Number.EPSILON).toFixed(2));
    // 4. Formatear el objeto de respuesta final, tal como lo hacía tu consulta SQL.
    const resultado = {
      titulo: 'Personas localizadas',
      // toLocaleString('es-MX') formatea el número con comas, similar a '999G999...'
      cantidad_total: totalCoincidencias.toLocaleString('es-MX'),
      cantidad_con_vida: totalConVida.toLocaleString('es-MX'),
      cantidad_sin_vida: totalSinVida.toLocaleString('es-MX'),
      cantidad_hombres: totalHombresLocalizados.toLocaleString('es-MX'),
      cantidad_mujeres: totalMujeresLocalizadas.toLocaleString('es-MX'),
      porcentaje_total: porcentaje
    };
    // console.log("resultado: ", resultado);
    data.process = "Obtener todos los registros localizados.";
    data.messageDEV = "Obtener todos los registros localizados.";
    data.messageUSR = "Los registros localizados fueron obtenidos Exitosamente.";
    data.dataRes = resultado;
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

export const getCountDesaparecidasRegVictimas = async (filtros) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener conteo de registros localizados.";
    data.method = "GET";
    data.api = "/";
    // 1. Construir la cláusula 'where' dinámicamente
    // Esto replica la lógica de '(columna = :PARAM or :PARAM is null)'
    const whereClause = {};
    whereClause.municipio_hechos = filtros.municipio ? filtros.municipio : null;
    whereClause.localidad_hechos = filtros.localidad ? filtros.localidad : null;
    whereClause.sexo_victima = filtros.sexo ? filtros.sexo : null;

    // 2. Ejecutar la consulta de conteo con la cláusula 'where'
    // Usamos .count() en lugar de .findAll() porque es mucho más eficiente
    // para obtener solo el número total de registros que coinciden.
    const totalCoincidencias = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'DESAPARECIDA%'
        }
      }
    });

    const totalHombresDesaparecidos = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'DESAPARECIDA%'
        },
        sexo_victima: {
          [Op.like]: 'H%'
        }
      }
    });
    const totalMujeresDesaparecidas = await bdp_reg_victimas.count({
      where: {
        // ...whereClause,
        estatus_victima: {
          [Op.like]: 'DESAPARECIDA%'
        },
        sexo_victima: {
          [Op.like]: 'M%'
        }
      }
    });

    // console.log("totalCoincidencias: ", totalCoincidencias);
    if (!totalCoincidencias) {
      data.status = 404;
      data.messageDEV = "No se encontraron registros localizados.";
      data.messageUSR = "No se encontraron registros localizados.";
      throw Error(data.messageDEV);
    }

    const totalVicEstado = await bdp_reg_victimas.count({
    })
    // console.log("totalVicEstado: ", totalVicEstado);
    if (!totalVicEstado) {
      data.status = 404;
      data.messageDEV = "No se encontraron parametros de total de victimas a nivel estatal.";
      data.messageUSR = "No se encontraron parametros de total de victimas a nivel estatal.";
      throw Error(data.messageDEV);
    }
    // 3. Realizar los cálculos y el formato en JavaScript
    // Esto es más limpio y mantenible que hacerlo directamente en la consulta SQL con Sequelize.

    let porcentaje = 0;
    const calculo = (totalCoincidencias /
      totalVicEstado) * 100; // Porcentaje base, se puede ajustar según la lógica de negocio.
    porcentaje = Number((calculo + Number.EPSILON).toFixed(2));
    // 4. Formatear el objeto de respuesta final, tal como lo hacía tu consulta SQL.
    const resultado = {
      titulo: 'Personas desaparecidas',
      // toLocaleString('es-MX') formatea el número con comas, similar a '999G999...'
      cantidad_total: totalCoincidencias.toLocaleString('es-MX'),
      cantidad_hombres: totalHombresDesaparecidos.toLocaleString('es-MX'),
      cantidad_mujeres: totalMujeresDesaparecidas.toLocaleString('es-MX'),
      porcentaje_total: porcentaje
    };
    // console.log("resultado: ", resultado);
    data.process = "Obtener todos los registros localizados.";
    data.messageDEV = "Obtener todos los registros localizados.";
    data.messageUSR = "Los registros localizados fueron obtenidos Exitosamente.";
    data.dataRes = resultado;
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

export const getDesaparecidosPorMunicipio = async (filtros) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener conteo de registros por municipio.";
    data.method = "GET";
    data.api = "/";
    // 1. Construir la cláusula 'where' dinámicamente
    // Esto replica la lógica de '(columna = :PARAM or :PARAM is null)'
    const whereClause = {};
    whereClause.municipio_hechos = filtros.municipio ? filtros.municipio : null;
    whereClause.localidad_hechos = filtros.localidad ? filtros.localidad : null;
    whereClause.sexo_victima = filtros.sexo ? filtros.sexo : null;

    // 1. Obtener todos los municipios
    const municipios = await bdp_cat_mun.findAll({
      attributes: ['NOMBRE_MUN'],
      raw: true
    });
    if (!municipios || municipios.length === 0) {
      data.status = 404;
      data.messageDEV = "No se encontraron municipios.";
      data.messageUSR = "No se encontraron municipios.";
      throw Error(data.messageDEV);
    }

    // 2. Obtener el conteo de víctimas por municipio
    const registros = await bdp_reg_victimas.findAll({
      attributes: [
        [Sequelize.col('BDP_CAT_MUN.NOMBRE_MUN'), 'municipio_nombre'],
        [Sequelize.fn('COUNT', Sequelize.col('BDP_REG_VICTIMAS.ID')), 'cantidad_victimas']
      ],
      include: [{
        model: bdp_cat_mun,
        attributes: [],
        required: true,
        where: {}
      }],
      where: {
        estatus_victima: {
          [Op.notLike]: 'LOCALIZADA%'
        },
        ...(filtros.municipio && { municipio_hechos: filtros.municipio }),
        ...(filtros.localidad && { localidad_hechos: filtros.localidad }),
        ...(filtros.sexo && { sexo_victima: filtros.sexo }),
      },
      group: ['BDP_CAT_MUN.NOMBRE_MUN'],
      raw: true
    });
    if (!registros || registros.length === 0) {
      data.status = 404;
      data.messageDEV = "No se encontraron registros por municipio.";
      data.messageUSR = "No se encontraron registros por municipio.";
      throw Error(data.messageDEV);
    }

    // 3. Unir ambos resultados, poniendo 0 donde no hay conteo
    const conteoPorMunicipio = municipios.map(mun => {
      const registro = registros.find(r => r.municipio_nombre === mun.NOMBRE_MUN);
      return {
        municipio_nombre: mun.NOMBRE_MUN,
        cantidad_victimas: registro ? parseInt(registro.cantidad_victimas) : 0
      };
    });

    
    // console.log("conteoPorMunicipio: ", conteoPorMunicipio);
    data.process = "Obtener todos los registros por municipio.";
    data.messageDEV = "Obtener todos los registros por municipio.";
    data.messageUSR = "Los registros por municipio fueron obtenidos Exitosamente.";
    data.dataRes = conteoPorMunicipio;
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

export const getRelacionDesaparecidos = async (filtros) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener relación de desaparecidos por municipio.";
    data.method = "GET";
    data.api = "/relacion-desaparecidos";

    // 1. Obtener todos los municipios
    const municipios = await bdp_cat_mun.findAll({
      attributes: ['NOMBRE_MUN'],
      raw: true
    });
    const municipiosNombres = municipios.map(m => m.NOMBRE_MUN);

    // 2. Obtener el total de desaparecidos (para el porcentaje)
    const totalDesaparecidos = await bdp_reg_victimas.count({
      where: {
        estatus_victima: { [Op.like]: 'DESAPARECIDA%' },
        ...(filtros.municipio && { municipio_hechos: filtros.municipio }),
        ...(filtros.localidad && { localidad_hechos: filtros.localidad }),
        ...(filtros.sexo && { sexo_victima: filtros.sexo }),
      }
    });

    // 3. Conteo por municipio de la lista oficial
    const registros = await bdp_reg_victimas.findAll({
      attributes: [
        ['MPIO_HECHOS', 'municipio_nombre'],
        [Sequelize.fn('COUNT', Sequelize.col('ID')), 'cantidad_victimas']
      ],
      where: {
        estatus_victima: { [Op.notLike]: 'LOCALIZADA%' },
        municipio_hechos: { [Op.in]: municipiosNombres },
        ...(filtros.municipio && { municipio_hechos: filtros.municipio }),
        ...(filtros.localidad && { localidad_hechos: filtros.localidad }),
        ...(filtros.sexo && { sexo_victima: filtros.sexo }),
      },
      group: ['MPIO_HECHOS'],
      raw: true
    });

    // 4. Conteo para "OTRAS ENTIDADES"
    const otrasEntidadesCount = await bdp_reg_victimas.count({
      where: {
        estatus_victima: { [Op.notLike]: 'LOCALIZADA%' },
        municipio_hechos: { [Op.notIn]: municipiosNombres },
        ...(filtros.localidad && { localidad_hechos: filtros.localidad }),
        ...(filtros.sexo && { sexo_victima: filtros.sexo }),
      }
    });

    // 5. Armar el arreglo de respuesta
    let respuesta = municipios.map(mun => {
      const registro = registros.find(r => r.municipio_nombre === mun.NOMBRE_MUN);
      const cantidad = registro ? parseInt(registro.cantidad_victimas) : 0;
      const porcentaje = totalDesaparecidos > 0 ? Number(((cantidad / totalDesaparecidos) * 100).toFixed(2)) : 0;
      return {
        municipio_nombre: mun.NOMBRE_MUN,
        cantidad_victimas: cantidad,
        porcentaje
      };
    });

    // Agregar "OTRAS ENTIDADES" si corresponde
    if (otrasEntidadesCount > 0) {
      respuesta.push({
        municipio_nombre: 'OTRAS ENTIDADES',
        cantidad_victimas: otrasEntidadesCount,
        porcentaje: totalDesaparecidos > 0 ? Number(((otrasEntidadesCount / totalDesaparecidos) * 100).toFixed(2)) : 0
      });
    }

    data.process = "Obtener relación de desaparecidos por municipio.";
    data.messageDEV = "Relación de desaparecidos por municipio obtenida.";
    data.messageUSR = "Relación de desaparecidos por municipio obtenida exitosamente.";
    data.dataRes = respuesta;
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