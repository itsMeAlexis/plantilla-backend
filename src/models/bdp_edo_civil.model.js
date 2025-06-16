import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_edo_civil = sequelize.define('BDP_EDO_CIVIL', {

  id_edo_civil: {
    type: DataTypes.INTEGER,
    allowNull: false, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: false, // Si quieres que sea autoincremental
    field: 'ID_EDOCIVIL' // Especifica el nombre exacto de la columna en la base de datos
  },
  clave: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: 'CLAVE_EDOCIVIL', // Especifica el nombre exacto de la columna en la base de datos
  },

  descripcion: {
    type: DataTypes.STRING(16),
    allowNull: false, // Se permite que el lugar sea nulo/vacío
    field: 'DESC_EDOCIVL', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_EDO_CIVIL',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_edo_civil;