import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_cat_nacionalidades = sequelize.define('BDP_CAT_NACIONALIDADES', {

  id_nacionalidad: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID_NACIONALIDAD' // Especifica el nombre exacto de la columna en la base de datos
  },
  nacionalidad: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'NACIONALIDAD', // Especifica el nombre exacto de la columna en la base de datos
  },

  pais: {
    type: DataTypes.STRING(50),
    allowNull: false, // Se permite que el lugar sea nulo/vacío
    field: 'PAIS', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_CAT_NACIONALIDADES',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_cat_nacionalidades;