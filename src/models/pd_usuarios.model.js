import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs'; 
import Roles from './pd_roles.model.js';

const pd_usuarios = sequelize.define('PD_USUARIOS', {

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que sea nulo, pero podría ser una FK a otra tabla
    primaryKey: true, // Define esta columna como la clave primaria
    autoIncrement: true, // Si quieres que sea autoincremental
    field: 'ID_USUARIO' // Especifica el nombre exacto de la columna en la base de datos
  },
  id_rol_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ID_ROL', // Especifica el nombre exacto de la columna en la base de datos
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false, // Se permite que el lugar sea nulo/vacío
    field: 'USUARIO', // Especifica el nombre exacto de la columna en la base de datos
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false, // Se permite que el lugar sea nulo/vacío
    field: 'PASSWORD', // Especifica el nombre exacto de la columna en la base de datos
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false, // Se permite que las observaciones sean nulas/vacías
    defaultValue: true, // Nuevo campo con valor por defecto
    field: 'ACTIVO', // Especifica el nombre exacto de la columna en la base de datos
  },
  cambio_password: {
    type: DataTypes.BOOLEAN,
    allowNull: true, // Se permite que las observaciones sean nulas/vacías
    defaultValue: true, // Nuevo campo con valor por defecto
    field: 'CAMBIO_PASSWORD', // Especifica el nombre exacto de la columna en la base de datos
  },
  nombre:{
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'NOMBRE', // Especifica el nombre exacto de la columna en la base de datos
  },
  appaterno:{
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'APPATERNO', // Especifica el nombre exacto de la columna en la base de datos
  },
  apmaterno:{
    type: DataTypes.STRING(50),
    allowNull: true, // Se permite que el lugar sea nulo/vacío
    field: 'APMATERNO', // Especifica el nombre exacto de la columna en la base de datos
  },
  num_intentos:{
    type: DataTypes.INTEGER,
    allowNull: true, // Se permite que las observaciones sean nulas/vacías
    field: 'NUM_INTENTOS', // Especifica el nombre exacto de la columna en la base de datos
  }
}, {
  // Opciones adicionales del modelo

  // Especifica el nombre exacto de la tabla en la base de datos.
  tableName: 'PD_USUARIOS',

  // Desactiva los campos createdAt y updatedAt que Sequelize añade por defecto.
  // Si los necesitas, simplemente pon esto en 'true' o elimínalo.
  timestamps: false,

  // Convierte los nombres de columna definidos en camelCase (ej: idBusqueda)
  // a snake_case (ej: id_busqueda) en la base de datos.
  // En este caso, ya los hemos definido con snake_case.
  underscored: true,

  // Hooks para hashear la contraseña
  hooks: {
    // Antes de crear un usuario
    beforeCreate: async (user) => {
      if (user.password) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    // Antes de actualizar un usuario
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    }
  }
});

// Método para validar contraseña
pd_usuarios.prototype.validarContrasena = async function (contrasena) {
  try {
    return await bcrypt.compare(contrasena, this.password);
  } catch (error) {
    console.error('Error al validar contraseña:', error);
    return false;
  }
}
pd_usuarios.hasOne(Roles, { foreignKey: 'id_rol', sourceKey: 'id_rol_usuario' });

export default pd_usuarios;