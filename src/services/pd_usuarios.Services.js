import Usuarios from "../models/pd_usuarios.model.js";
import Roles from "../models/pd_roles.model.js";
import { BITACORA, DATA, OK, AddMSG, FAIL } from '../middleware/respPWA.handler.js';
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';

export const createUser = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
      bitacora.process = "Registrar un nuevo usuario.";
      data.method = "POST";
      data.api = "/";

      const user = await Usuarios.create(body);
      if (!user) {
          data.status = 400;
          data.messageDEV = "Error al registrar usuario.";
          data.messageUSR = "Error al registrar usuario.";
          throw Error(data.messageDEV);
      }

      data.process = "Registrar un nuevo usuario.";
      data.messageDEV = "Se creo el usuario con exito.";
      data.messageUSR = "Se creo el usuario con exito.";
      data.dataRes = {user};
      bitacora = AddMSG(bitacora, data, "OK", 200, true);  
      return OK(bitacora);
  } catch (error) {
      if (!data.status) data.status = error.statusCode;
      let { message } = error;
      if (!data.messageDEV) data.messageDEV = message;
      if (!data.messageUSR) data.messageUSR = message;
      if (data.dataRes.length === 0) data.dataRes = error;
      bitacora = AddMSG(bitacora, data, "FAIL");
      return FAIL(bitacora);
  }
};

export const getAllUsers = async (queryParams = {}) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = "Obtener todos los usuarios.";
    data.method = "GET";
    data.api = "/";

    const options = {
      include: [{
        model: Roles,
        as: 'PD_ROLE',
        attributes: ['ID_ROL', 'LETRA_ROL', 'DESCRIPCION']
      }],
      attributes: { 
        // solamente se excluye la pass porq pa q la quieres jajaja
        exclude: ['PASSWORD'] 
      },
    };

    // Paginación
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const offset = (page - 1) * limit;

    options.limit = limit;
    options.offset = offset;

    const { count, rows: users } = await Usuarios.findAndCountAll(options);

    if (!users || users.length === 0) {
      data.status = 404;
      data.messageDEV = "No se encontraron usuarios.";
      data.messageUSR = "No hay usuarios registrados.";
      throw new Error(data.messageDEV);
    }

    data.process = "Obtener todos los usuarios.";
    data.messageDEV = "Usuarios obtenidos exitosamente.";
    data.messageUSR = "Usuarios obtenidos exitosamente.";
    data.dataRes = {
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
    
    bitacora = AddMSG(bitacora, data, "OK", 200, true);  
    return OK(bitacora);
    
  } catch (error) {
    if (!data.status) data.status = error.statusCode || 500;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = "Error al obtener usuarios.";
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};

export const getUserById = async (userId) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = "Obtener usuario por ID.";
    data.method = "GET";
    data.api = "/:id";

    if (!userId) {
      data.status = 400;
      data.messageDEV = "ID de usuario no proporcionado.";
      data.messageUSR = "Por favor, proporciona el ID del usuario.";
      throw new Error(data.messageDEV);
    }

    const user = await Usuarios.findOne({
      where: {
        ID_USUARIO: userId,
      },
      include: [{
        model: Roles,
        as: 'PD_ROLE',
        attributes: ['ID_ROL', 'LETRA_ROL', 'DESCRIPCION']
      }],
      attributes: {
        // solamente se excluye la pass porq pa q la quieres jajaja
        exclude: ['PASSWORD']
      }
    });

    if (!user) {
      data.status = 404;
      data.messageDEV = `No se encontró usuario con el ID ${userId}.`;
      data.messageUSR = "Usuario no encontrado.";
      throw new Error(data.messageDEV);
    }

    data.process = "Obtener usuario por ID.";
    data.messageDEV = "Usuario obtenido exitosamente.";
    data.messageUSR = "Usuario obtenido exitosamente.";
    data.dataRes = user;

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);

  } catch (error) {
    if (!data.status) data.status = error.statusCode || 500;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = "Error al obtener usuario.";
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};

export const updateUser = async (body, userId) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = "Actualizar usuario.";
    data.method = "PUT";
    data.api = "/:id";

    if (!userId) {
      data.status = 400;
      data.messageDEV = "ID de usuario no proporcionado.";
      data.messageUSR = "Por favor, proporciona el ID del usuario.";
      throw new Error(data.messageDEV);
    }

    const user = await Usuarios.findOne({
      where: {
        ID_USUARIO: userId,
        activo: true, // Solo usuarios activos
      }
    });

    if (!user) {
      data.status = 404;
      data.messageDEV = `No se encontró usuario con el ID ${userId}.`;
      data.messageUSR = "Usuario no encontrado.";
      throw new Error(data.messageDEV);
    }

    const updatedUser = await Usuarios.update(body, {
      where: {
        ID_USUARIO: userId
      }
    });

    if (!updatedUser) {
      data.status = 500;
      data.messageDEV = "Error al actualizar usuario.";
      data.messageUSR = "Error al actualizar usuario.";
      throw new Error(data.messageDEV);
    }

    data.process = "Actualizar usuario.";
    data.messageDEV = "Usuario actualizado exitosamente.";
    data.messageUSR = "Usuario actualizado exitosamente.";
    data.dataRes = user;

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);  
    } catch (error) {
      if (!data.status) data.status = error.statusCode || 500;
      let { message } = error;
      if (!data.messageDEV) data.messageDEV = message;
      if (!data.messageUSR) data.messageUSR = "Error al actualizar usuario.";
      if (data.dataRes.length === 0) data.dataRes = error;
      bitacora = AddMSG(bitacora, data, "FAIL");
      return FAIL(bitacora);
    }
};

export const updateProfile = async (body, userId) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { password } = body;
  delete body.password;
  delete body.token;

  try {
    bitacora.process = "Actualizar perfil de usuario.";
    data.method = "PUT";
    data.api = "/:id";

    if (!userId) {
      data.status = 400;
      data.messageDEV = "ID de usuario no proporcionado.";
      data.messageUSR = "Por favor, proporciona el ID del usuario.";
      throw new Error(data.messageDEV);
    }

    let user = await Usuarios.findOne({
      where: {
        ID_USUARIO: userId,
        activo: true, // Solo usuarios activos
      }
    });

    if (!user) {
      data.status = 404;
      data.messageDEV = `No se encontró usuario con el ID ${userId}.`;
      data.messageUSR = "Usuario no encontrado.";
      throw new Error(data.messageDEV);
    }

    const isMatch = await user.validarContrasena(password);
    let updatedUser = false;

    if (isMatch) {
      // Verificar si el nuevo nombre de usuario ya existe en otro usuario
      if (body.username) {
        const usuarioExistente = await Usuarios.findOne({
          where: {
            usuario: body.username,
            ID_USUARIO: { [Op.ne]: userId } // Excluye el usuario actual
          }
        });
        if (usuarioExistente) {
          data.status = 409;
          data.messageDEV = "El nombre de usuario ya está en uso.";
          data.messageUSR = "El nombre de usuario ya está en uso.";
          throw new Error(data.messageDEV);
        }
      }

      user.username = body.username || user.username;
      user.nombre = body.nombre || user.nombre;
      user.appaterno = body.appaterno || user.appaterno;
      user.apmaterno = body.apmaterno || user.apmaterno;
      user.password = body.newPassword || user.password; // Actualiza la contraseña si se proporciona una nueva
      
      updatedUser = await user.save();
    }

    if (!updatedUser) {
      data.status = 500;
      data.messageDEV = "Error al actualizar usuario.";
      data.messageUSR = "Error al actualizar usuario.";
      throw new Error(data.messageDEV);
    }

    data.process = "Actualizar usuario.";
    data.messageDEV = "Usuario actualizado correctamente.";
    data.messageUSR = "Usuario actualizado correctamente.";
    data.dataRes = user;

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);  
    } catch (error) {
      if (!data.status) data.status = error.statusCode || 500;
      let { message } = error;
      if (!data.messageDEV) data.messageDEV = message;
      if (!data.messageUSR) data.messageUSR = "Error al actualizar usuario.";
      if (data.dataRes.length === 0) data.dataRes = error;
      bitacora = AddMSG(bitacora, data, "FAIL");
      return FAIL(bitacora);
    }
};

export const changeUserStatus = async (userId) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = "Cambiar estado de usuario.";
    data.method = "PATCH";
    data.api = "/:id";

    if (!userId || isNaN(userId)) {
      data.status = 400;
      data.messageDEV = "ID de usuario inválido. El ID debe ser un número entero.";
      data.messageUSR = "Por favor, proporciona un ID de usuario válido.";
      throw new Error(data.messageDEV);
    }

    // Buscar el usuario para obtener su estado actual
    const userToUpdate = await Usuarios.findByPk(userId);

    if (!userToUpdate) {
      data.status = 404;
      data.messageDEV = `No se encontró usuario con el ID ${userId}.`;
      data.messageUSR = "Usuario no encontrado.";
      throw new Error(data.messageDEV);
    }

    // Alternar el valor de 'activo'
    const newStatus = !userToUpdate.activo;

    // Actualizar el estado del usuario en la base de datos
    const [rowsUpdated] = await Usuarios.update({ activo: newStatus }, {
      where: {
        ID_USUARIO: userId
      }
    });

    if (rowsUpdated === 0) {
      data.status = 409;
      data.messageDEV = "No se aplicaron cambios al estado del usuario.";
      data.messageUSR = "No se aplicaron cambios.";
      throw new Error(data.messageDEV);
    }

    // Obtener el usuario con el estado actualizado para la respuesta
    const updatedUser = await Usuarios.findByPk(userId, {
      attributes: {
        exclude: ['PASSWORD']
      }
    });

    data.process = "Cambiar estado de usuario.";
    data.messageDEV = `Estado de usuario cambiado a ${newStatus ? 'activo' : 'inactivo'}.`;
    data.messageUSR = `Estado de usuario cambiado a ${newStatus ? 'activo' : 'inactivo'}.`;
    data.dataRes = updatedUser;

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);

  } catch (error) {
    if (!data.status) data.status = error.statusCode || 500;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = "Error al cambiar el estado del usuario.";
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};
    
