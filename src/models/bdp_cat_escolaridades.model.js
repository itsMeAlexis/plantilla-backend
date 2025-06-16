import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_cat_escolaridades = sequelize.define('BDP_CAT_ESCOLARIDADES', {

  id_escolaridad: {
    type: DataTypes.INTEGER,
    allowNull: false, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: false, // Si quieres que sea autoincremental
    field: 'ID_ESCOLARIDAD' // Especifica el nombre exacto de la columna en la base de datos
  },
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'DESCRIPCION_ESCOLARIDAD', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_CAT_ESCOLARIDADES',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_cat_escolaridades;