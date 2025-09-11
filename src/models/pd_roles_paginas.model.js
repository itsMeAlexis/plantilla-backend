import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const pd_roles_paginas = sequelize.define('PD_ROLES_PAGINAS', {

  id_rol_rp:{
    type: DataTypes.INTEGER,
    allowNull: false, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    field: 'ID_ROL' // Especifica el nombre exacto de la columna en la base de datos
  },
  id_pagina_rp: {
    type: DataTypes.INTEGER,
    allowNull: false, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    field: 'ID_PAGINA' // Especifica el nombre exacto de la columna en la base de datos
  },
  create: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: true,
    field: 'CREATE', // Especifica el nombre exacto de la columna en la base de datos
  },
  read:{
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: true,
    field: 'READ', // Especifica el nombre exacto de la columna en la base de datos
  },
  update:{
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: true,
    field: 'UPDATE', // Especifica el nombre exacto de la columna en la base de datos
  },
  delete:{
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: true,
    field: 'DELETE', // Especifica el nombre exacto de la columna en la base de datos
  }
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'PD_ROLES_PAGINAS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default pd_roles_paginas;