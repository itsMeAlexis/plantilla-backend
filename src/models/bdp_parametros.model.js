import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_parametros = sequelize.define('BDP_PARAMETROS', {

  id_parametro: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID_PARAMETRO' // Especifica el nombre exacto de la columna en la base de datos
  },
  tema: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'TEMA', // Especifica el nombre exacto de la columna en la base de datos
  },

  texto: {
    type: DataTypes.STRING(80),
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'TEXTO', // Especifica el nombre exacto de la columna en la base de datos
  },

  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que las observaciones sean nulas/vacías
    field: 'CANTIDAD', // Especifica el nombre exacto de la columna en la base de datos
  },
  tipo: {
    type: DataTypes.STRING(3),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'TIPO', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_PARAMETROS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_parametros;