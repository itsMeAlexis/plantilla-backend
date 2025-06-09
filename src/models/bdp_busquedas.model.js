// Este archivo podría llamarse, por ejemplo, 'busqueda.model.js'
// Reemplaza el contenido del archivo anterior por este.

import { DataTypes } from 'sequelize';

// Este es el objeto 'sequelize' que obtendrías al inicializar la conexión
// en un archivo central de configuración de base de datos.
// Ejemplo de 'database.js':
//
// import { Sequelize } from 'sequelize';
// import config from './config.js';
//
// const sequelize = new Sequelize(config.DATABASE, config.DB_USER, config.DB_PASSWORD, {
//   host: config.CLUSTER,
//   dialect: 'postgres'
// });
//
// export default sequelize;
import sequelize from '../config/database.js'; // Asegúrate de que esta ruta es correcta

/**
 * Definición del modelo para la tabla 'busquedas' usando Sequelize.
 * * Sequelize utilizará esta definición para interactuar con la tabla,
 * permitiendo crear, leer, actualizar y eliminar registros
 * a través de métodos de JavaScript en lugar de escribir SQL manualmente.
 */
const bdp_busquedas = sequelize.define('BDP_BUSQUEDAS', {
  // Sequelize añade por defecto una columna 'id' como PRIMARY KEY autoincremental.
  // Si quieres definirla explícitamente, puedes hacerlo así:
  // id: {
  //   type: DataTypes.INTEGER,
  //   autoIncrement: true,
  //   primaryKey: true
  // },

  id_busqueda: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID_BUSQUEDA' // Especifica el nombre exacto de la columna en la base de datos
  },

  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'FECHA', // Especifica el nombre exacto de la columna en la base de datos
  },

  lugar: {
    type: DataTypes.STRING(100),
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'LUGAR', // Especifica el nombre exacto de la columna en la base de datos
  },

  observaciones: {
    type: DataTypes.STRING(1000),
    allowNull: true, // Se permite que las observaciones sean nulas/vacías
    field: 'OBSERVACIONES', // Especifica el nombre exacto de la columna en la base de datos
  },
  tipo_busqueda: {
    type: DataTypes.STRING(1),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'TIPO_BUSQUEDA', // Especifica el nombre exacto de la columna en la base de datos
  },
  tipo_accion: {
    type: DataTypes.STRING(1),
    allowNull: true, // Se permite que el tipo de acción sea nulo/vacío
    field: 'TIPO_ACCION', // Especifica el nombre exacto de la columna en la base de datos
  },
  no_bitacora: {
    type: DataTypes.STRING(35),
    allowNull: true, // Se permite que el número de bitácora sea nulo/vacío
    field: 'NO_BITACORA', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_BUSQUEDAS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

// Ahora puedes exportar el modelo para usarlo en tus services y controllers.
// Ejemplo de uso en un service:
//
// import bdp_busquedas from './bdp_busquedas.model.js';
//
// async function crearBusqueda(datos) {
//   return await Busqueda.create(datos);
// }
//
// async function obtenerTodasLasBusquedas() {
//   return await Busqueda.findAll();
// }

export default bdp_busquedas;