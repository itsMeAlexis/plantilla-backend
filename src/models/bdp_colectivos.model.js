import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_colectivos = sequelize.define('BDP_COLECTIVOS', {

  id_colectivo: {
    type: DataTypes.INTEGER,
    allowNull: false, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: false, // Si quieres que sea autoincremental
    field: 'ID_COLECTIVO' // Especifica el nombre exacto de la columna en la base de datos
  },
  nombre_colectivo: {
    type: DataTypes.STRING(4000),
    allowNull: false,
    field: 'NOMBRE_COL', // Especifica el nombre exacto de la columna en la base de datos
  },
  domicilio_colectivo: {
    type: DataTypes.STRING(255),
    allowNull: false, // Se permite que el lugar sea nulo/vacío
    field: 'DOMICILIO_COL', // Especifica el nombre exacto de la columna en la base de datos
  },
  red_social_1: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'RED_SOCIAL1', // Especifica el nombre exacto de la columna en la base de datos
  },
  red_social_2: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'RED_SOCIAL2', // Especifica el nombre exacto de la columna en la base de datos
  },
  hay_acta: {
    type: DataTypes.STRING(1),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'HAY_ACTA', // Especifica el nombre exacto de la columna en la base de datos
  },
  fecha_acta: {
    type: DataTypes.DATE,
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'FEC_ACTA', // Especifica el nombre exacto de la columna en la base de datos
  },
  numero_acta: {
    type: DataTypes.STRING(40),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'NUM_ACTA', // Especifica el nombre exacto de la columna en la base de datos
  },
  representante: {
    type: DataTypes.STRING(150),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'REPRESENTANTE', // Especifica el nombre exacto de la columna en la base de datos
  },
  representante_suplente: {
    type: DataTypes.STRING(150),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'REPRESENTANTE_SUP', // Especifica el nombre exacto de la columna en la base de datos
  },
  email_representante: {
    type: DataTypes.STRING(40),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'EMAIL_REPRE', // Especifica el nombre exacto de la columna en la base de datos
  },
  domicilio_representante: {
    type: DataTypes.STRING(80),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'DOM_REPRE', // Especifica el nombre exacto de la columna en la base de datos
  },
  telefono_representante: {
    type: DataTypes.STRING(20),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'TEL1_REPRE', // Especifica el nombre exacto de la columna en la base de datos
  },
  celular_1_representante:{
    type: DataTypes.STRING(20),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'CEL1_REPRE', // Especifica el nombre exacto de la columna en la base de datos
  },
  celular_2_representante: {
    type: DataTypes.STRING(20),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'CEL2_REPRE', // Especifica el nombre exacto de la columna en la base de datos
  },
  numero_miembros: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'NUM_MIEMBROS', // Especifica el nombre exacto de la columna en la base de datos
  }
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_COLECTIVOS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_colectivos;