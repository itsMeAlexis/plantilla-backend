import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_cat_mun = sequelize.define('BDP_CAT_MUN', {

  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID_MUN' // Especifica el nombre exacto de la columna en la base de datos
  },
  clave_municipio: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'CLAVE_MUNI', // Especifica el nombre exacto de la columna en la base de datos
  },

  nombre_municipio: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'NOMBRE_MUN', // Especifica el nombre exacto de la columna en la base de datos
  },

  clave_estado: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que las observaciones sean nulas/vacías
    field: 'CLAVE_EDO', // Especifica el nombre exacto de la columna en la base de datos
  },
  activo: {
    type: DataTypes.STRING(1),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ACTIVO', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_CAT_MUN',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_cat_mun;