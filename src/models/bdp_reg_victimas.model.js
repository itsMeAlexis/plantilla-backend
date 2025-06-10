import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const bdp_reg_victimas = sequelize.define('BDP_REG_VICTIMAS', {

  id_victima: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID' // Especifica el nombre exacto de la columna en la base de datos
  },
  no_expediente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'NO__EXP_', // Especifica el nombre exacto de la columna en la base de datos
  },

  fecha_registro: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'FEC_REG', // Especifica el nombre exacto de la columna en la base de datos
  },

  expediente: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que las observaciones sean nulas/vacías
    field: 'EXPEDIENTE', // Especifica el nombre exacto de la columna en la base de datos
  },
  carpeta_investigacion: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'CARPETA_INV', // Especifica el nombre exacto de la columna en la base de datos
  },
  nombre_victima: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'NOMBRE_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  appaterno_victima: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'APPATERNO_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  apmaterno_victima: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'APMATERNO_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  alias_victima: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ALIAS_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  sexo_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'SEXO_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  nacionalidad_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'NACIONALIDAD_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  estado_civil_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ESTADO_CIVIL_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  escolaridad_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ESCOLARIDAD_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  ocupacion_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'OCUPACION_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  curp_victima: {
    type: DataTypes.STRING(18),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'CURP_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  edad_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'EDAD_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  fecha_nacimiento_victima: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'FECNAC_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  estado_nacimiento_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ESTADO_NAC_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  estatus_victima: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ESTATUS_VIC', // Especifica el nombre exacto de la columna en la base de datos
  },
  estatus_victima_obs: {
    type: DataTypes.STRING(100),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ESTATUS_VIC_OBS', // Especifica el nombre exacto de la columna en la base de datos
  },
  foliounico_busqueda: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'FOLIOUNICO_BUSQ', // Especifica el nombre exacto de la columna en la base de datos
  },
  parentesco_reportante: {
    type: DataTypes.STRING(150),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'PARENTESCO_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  nombre_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'NOMBRE_QREPORTA', // Especifica el nombre exacto de la columna en la base de datos
  },
  appaterno_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'APPATERNO_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  apmaterno_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'APMATERNO_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  sexo_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'SEXO_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  nacionalidad_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'NACIONALIDAD_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  estado_civil_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'EDOCIVIL_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  escolaridad_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'ESCOLARIDAD_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  ocupacion_reportante: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'OCUPACION_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  curp_reportante: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'CURP_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  edad_reportante: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'EDAD_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  fecha_nacimiento_reportante: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'FEC_NAC_QREP', // Especifica el nombre exacto de la columna en la base de datos
  },
  telefono_reportante_1: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'TEL_CONTACTO_1', // Especifica el nombre exacto de la columna en la base de datos
  },
  telefono_reportante_2: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'TEL_CONTACTO_2', // Especifica el nombre exacto de la columna en la base de datos
  },
  correo_reportante: {
    type: DataTypes.STRING(255),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'CORREO_CONTACTO', // Especifica el nombre exacto de la columna en la base de datos
  },
  municipio_hechos: {
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'MPIO_HECHOS', // Especifica el nombre exacto de la columna en la base de datos
  },
  localidad_hechos: {
    type: DataTypes.STRING(4000),
    allowNull: true, // Se permite que el tipo de búsqueda sea nulo/vacío
    field: 'LOC_HECHOS', // Especifica el nombre exacto de la columna en la base de datos
  },
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'BDP_REG_VICTIMAS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default bdp_reg_victimas;