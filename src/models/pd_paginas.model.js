import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const pd_paginas = sequelize.define('PD_PAGINAS', {

  id_pagina: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID_PAGINA' // Especifica el nombre exacto de la columna en la base de datos
  },
  path: {
    type: DataTypes.STRING(20),  
    allowNull: false,
    field: 'PATH', // Especifica el nombre exacto de la columna en la base de datos
  },
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false, // Se permite que el lugar sea nulo/vacío
    field: 'DESCRIPCION', // Especifica el nombre exacto de la columna en la base de datos
  },
  prioridad: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'PRIORIDAD', // Especifica el nombre exacto de la columna en la base de datos
  }
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'PD_PAGINAS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,
});

export default pd_paginas;