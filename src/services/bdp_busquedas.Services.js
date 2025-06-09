import bdp_busquedas from "../models/bdp_busquedas.model.js";
import { authToken } from "./auth.Services.js";
import {
  BITACORA,
  DATA,
  OK,
  AddMSG,
  FAIL,
} from "../middleware/respPWA.handler.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';
import { fileURLToPath } from 'url';

export const getBusquedas = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Obtener todas las busquedas.";
    data.method = "GET";
    data.api = "/" + id;
    //Obtener todas las busquedas usando sequelize
    const busquedas = await bdp_busquedas.findAll();

    if (!busquedas) {
      data.status = 404;
      data.messageDEV = "No se encontraron busquedas.";
      data.messageUSR = "No se encontraron busquedas.";
      throw Error(data.messageDEV);
    }
    console.log("Busquedas: ", busquedas);
    data.process = "Obtener todas las busquedas.";
    data.messageDEV = "Obtener todas las busquedas.";
    data.messageUSR = "Las busquedas fueron obtenidas Exitosamente.";
    data.dataRes = busquedas;
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

export const updateUser = async (id, usuarioActualizado, file) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    const userData = {
      Usuario: usuarioActualizado.Login,
      Password: usuarioActualizado.Password, // Elimina campo si es vacío
      Activo: usuarioActualizado.Activo,
      Foto: usuarioActualizado.Foto,
      Rol: {
        IdRolOK: usuarioActualizado.TipoUsuario,
        permisos_especiales: usuarioActualizado.permisos_especiales || [],
      },
    };

    if (userData.Password === undefined) {
      delete userData.Password;
    }

    //console.log("Usuario Actualizado: ", usuarioActualizado); 

    const personaData = {
      Nombre: usuarioActualizado.Nombre,
      ApPaterno: usuarioActualizado.Paterno,
      ApMaterno: usuarioActualizado.Materno,
      Curp: usuarioActualizado.Curp,
      cat_personas_telefonos: [
        {
          NumTelefono: usuarioActualizado.Celular || "", // Elimina campo si es vacío
        },
      ],
      cat_personas_correos: [
        {
          Email: usuarioActualizado.Email || "", // Elimina campo si es vacío
        },
      ],
    };

    // Guardar la imagen en el servidor si existe
    if (file) {
      userData.Foto = file.path;
    } else {
      delete userData.Foto;
    }

    // Buscar usuario
    const user = await Usuarios.findOne({ IdUsuario: id });
    if (!user) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontró al usuario.";
      throw new Error(data.messageDEV);
    }

    // Actualizar persona
    const persona = await Personas.findOne({ IdPersona: user.IdPersona });
    if (!persona) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontró a la persona.";
      throw new Error(data.messageDEV);
    }

    persona.set(personaData);
    const updatedPersona = await persona.save();
    if (!updatedPersona) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> actualizó la persona.";
      throw new Error(data.messageDEV);
    }

    // Actualizar o crear médico si corresponde
    if (user.Rol.IdRolOK === "M" && usuarioActualizado.TipoUsuario === "M") {
      let medic = await Medicos.findOne({ IdUsuario: user.IdUsuario });
      console.log("Medico: ", medic);
      console.log("Usuario Actualizado: ", usuarioActualizado);
      if (!medic) {
        // Crear médico si no existe
        const bodyMedic = {
          IdEspecialidad: usuarioActualizado.Especialidad,
          CedulaProfesional: usuarioActualizado.CedulaProfesional,
          FechaRegistro: new Date().toISOString().slice(0, 10),
        };
        medic = await Medicos.create(bodyMedic);
      } else {
        // Actualizar médico existente
        medic.set({
          IdEspecialidad: usuarioActualizado.IdEspecialidad,
          CedulaProfesional: usuarioActualizado.CedulaProfesional,
        });
        const updatedMedic = await medic.save();
        if (!updatedMedic) {
          data.status = 404;
          data.messageDEV = "La base de datos <<NO>> actualizó el médico.";
          throw new Error(data.messageDEV);
        }
      }
    }

    // Actualizar usuario
    user.set(userData);
    const updatedUser = await user.save();
    if (!updatedUser) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> actualizó el usuario.";
      throw new Error(data.messageDEV);
    }

    // Respuesta final
    data.process = "Actualizar un usuario.";
    data.messageDEV = "La actualización del usuario fue Exitosa.";
    data.messageUSR = "La actualización del usuario fue Exitosa.";
    data.dataRes = {
      user,
      respuesta: 1,
      mensaje: "Actualización Exitosa",
    };

    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return {
      data: user,
      respuesta: 1,
      mensaje: "Actualización Exitosa",
      devData: bitacora,
    };
  } catch (error) {
    console.error(error);
    if (!data.status) data.status = 500; // Error interno por defecto
    data.messageDEV = error.message || "Error desconocido";
    data.messageUSR = "Ocurrió un error al actualizar el usuario.";
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};

export const updateUser2 = async (body, token) => {
  let bitacora = BITACORA();
  let data = DATA();
  let UsuarioChange = false;

  try {
    bitacora.process = 'Actualizar la informacion del usuario.';
    data.method = 'PUT';
    data.api = '/usuarios/updateUser';

    bitacora = await authToken(bitacora, token);
    if(!bitacora.success){
      data.status = 400;
      data.messageDEV = "Error al obtener el token.";
      data.messageUSR = "Error al obtener el token.";
      throw Error(data.messageDEV);
    }

    let dataCount = bitacora.countData - 1;
    let userInfo = bitacora.data[dataCount].dataRes;
    let userRol = userInfo.Rol.IdRolOK;
    let x=0;

    //GRX: validar existencia de credenciales
    if (!body.credentials) {
      data.status = 400;
			data.messageDEV = "Error al validar las credenciales.";
			data.messageUSR = "Error al validar las credenciales.";
			throw Error(data.messageDEV);
    }

    //GRX: obtener credenciales
    const credentials = Buffer.from(body.credentials, "base64").toString("utf8");
    const [Login, Password] = credentials.split(":");

    //GRX: obtener el usuario actual
    const user = await Usuarios.findOne({
      IdUsuario : userInfo.IdUsuario
    })

    //GRX: validar credenciales
    const isMatch = await user.validarContrasena(Password);
    if (!isMatch) {
      data.status = 400;
			data.messageDEV = "Error al validar las contraseñas.";
			data.messageUSR = "Error al validar las contraseñas.";
			throw Error(data.messageDEV);
    }
    
    //GRX: ver si se cambio el nombre de usuario
    if (body.formData.usuario !== Login) {
      UsuarioChange = true;
    }
    let xy = 0;
    if (UsuarioChange){
      //GRX: ver que no exista otro usuario con el mismo nombre
      const user2 = await Usuarios.findOne({
        Usuario : body.formData.usuario
      });
      if (user2) {
        data.status = 400;
        data.messageDEV = "Ya existe un usuario con el mismo nombre.";
        data.messageUSR = "Ya existe un usuario con el mismo nombre.";
        throw Error(data.messageDEV);
      }
      //GRX: actualizar el usuario
      user.set({Usuario: body.formData.usuario});
      const updatedUser = await user.save();
      if (!updatedUser) {
        data.status = 404;
        data.messageDEV = "La base de datos <<NO>> actualizó el usuario.";
        throw new Error(data.messageDEV);
      }
    }

    //GRX: buscar la persona
    const persona = await Personas.findOne({
      IdPersona : user.IdPersona
    });
    if (!persona) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontró la persona.";
      data.messageUSR = "No se encontró la persona.";
      throw new Error(data.messageDEV);
    }

    //GRX: actualizar la persona
    //GRX: crear objeto de persona
    let personaJson = {
      Nombre: body.formData.nombre,
      ApPaterno: body.formData.apellidoPaterno,
      ApMaterno: body.formData.apellidoMaterno,
      Curp: body.formData.curp,
      cat_personas_telefonos: persona.cat_personas_telefonos,
      cat_personas_correos: persona.cat_personas_correos,
    };

    //GRX: actualizar la persona objetos de telefonos y correos
    let telefonoActual = "";
    //GRX: Obtener el telefono actual
    persona.cat_personas_telefonos.forEach(element => {
      if (element.detail_row.Activo === "S") {
        telefonoActual = element.NumTelefono;
        return; // salir del loop una vez encontrado
      }
    });
    //GRX: quitar espacios
    telefonoActual = telefonoActual.replace(/\s+/g, '');
    body.formData.telefono = body.formData.telefono.replace(/\s+/g, '');
    if (telefonoActual === "" && body.formData.telefono !== "") {
      //GRX: si es vacio puede ser que no haya telefonos en la BD o que el telefono actual sea ""
      personaJson.cat_personas_telefonos.forEach(element => {
        element.detail_row.Activo = "N";
      });
      personaJson.cat_personas_telefonos.push({
        NumTelefono: body.formData.telefono
      });
    }else if (telefonoActual !== body.formData.telefono) {
      //GRX: si el telefono actual no es el mismo que el nuevo telefono se cambia
      personaJson.cat_personas_telefonos.forEach(element => {
        element.detail_row.Activo = "N";
      });
      personaJson.cat_personas_telefonos.push({
        NumTelefono: body.formData.telefono
      });
    }

    //GRX: ver si se actualizo el correo
    let correoActual = "";
    //GRX: Obtener el correo actual
    persona.cat_personas_correos.forEach(element => {
      if (element.detail_row.Activo === "S") {
        correoActual = element.Email;
        return; // salir del loop una vez encontrado
      }
    });
    //GRX: quitar espacios
    correoActual = correoActual.replace(/\s+/g, '');
    body.formData.correo = body.formData.correo.replace(/\s+/g, '');
    if (correoActual === "") {
      //GRX: si es vacio puede ser que no haya correos en la BD o que el correo actual sea ""
      personaJson.cat_personas_correos.forEach(element => {
        element.detail_row.Activo = "N";
      });
      personaJson.cat_personas_correos.push({
        Email: body.formData.correo
      });
    }else if (correoActual !== body.formData.correo) {
      //GRX: si el correo actual no es el mismo que el nuevo correo se cambia
      personaJson.cat_personas_correos.forEach(element => {
        element.detail_row.Activo = "N";
      });
      personaJson.cat_personas_correos.push({
        Email: body.formData.correo
      });
    }

    //GRX: actualizar la persona
    persona.set(personaJson);
    const updatedPersona = await persona.save();
    if (!updatedPersona) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> actualizó la persona.";
      data.messageUSR = "No se pudo actualizar la información.";
      throw new Error(data.messageDEV);
    }
    
    //GRX: ver el rol del usuario
    if (userRol === "M") {
      //OBTENER al medico
      const medico = await Medicos.findOne({
        IdUsuario: userInfo.IdUsuario
      });
      if (!medico) {
        data.status = 404;
        data.messageDEV = "La base de datos <<NO>> encontró el medico.";
        data.messageUSR = "No se encontró el medico.";
        throw new Error(data.messageDEV);
      }
      //GRX: hacer objeto del medico
      let medicoJson = {
        IdEspecialidad: body.formData.especialidad,
        CedulaProfesional: body.formData.cedula
      }
      //GRX: actualizar el medico
      medico.set(medicoJson);
      const updatedMedico = await medico.save();
      if (!updatedMedico) {
        data.status = 404;
        data.messageDEV = "La base de datos <<NO>> actualizó el medico.";
        data.messageUSR = "No se pudo actualizar la información del medico.";
        throw new Error(data.messageDEV);
      }
    }

    data.status = 200;
    data.messageDEV = "Se actualizo el usuario.";
    data.messageUSR = "Se actualizo el usuario.";
    bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora);
  } catch (error) {
    data.status = 400;
    data.messageDEV = error.message;
    data.messageUSR = error.message;
    bitacora = AddMSG(bitacora, data, 'FAIL', 400, true);
    return FAIL(bitacora);
  }
}

export const updatePassword = async (body, token) => {
  let bitacora = BITACORA();
  let data = DATA();
  let UsuarioChange = false;

  try {
    bitacora.process = 'Actualizar la informacion del usuario.';
    data.method = 'PUT';
    data.api = '/usuarios/updatePassword';

    bitacora = await authToken(bitacora, token);
    if(!bitacora.success){
      data.status = 400;
      data.messageDEV = "Error al obtener el token.";
      data.messageUSR = "Error al obtener el token.";
      throw Error(data.messageDEV);
    }

    let dataCount = bitacora.countData - 1;
    let userInfo = bitacora.data[dataCount].dataRes;
    let userRol = userInfo.Rol.IdRolOK;
    let x=0;

    //GRX: validar existencia de credenciales
    if (!body.credentials) {
      data.status = 400;
			data.messageDEV = "Error al validar las credenciales.";
			data.messageUSR = "Error al validar las credenciales.";
			throw Error(data.messageDEV);
    }

    //GRX: obtener credenciales
    const credentials = Buffer.from(body.credentials, "base64").toString("utf8");
    const [Login, Password] = credentials.split(":");

    //GRX: obtener el usuario actual
    const user = await Usuarios.findOne({
      IdUsuario : userInfo.IdUsuario
    })

    //GRX: validar credenciales
    const isMatch = await user.validarContrasena(Password);
    if (!isMatch) {
      data.status = 400;
			data.messageDEV = "Error al validar las contraseñas.";
			data.messageUSR = "Error al validar las contraseñas.";
			throw Error(data.messageDEV);
    }

    let xy = 0;

    //GRX: actualizar la contraseña
    user.Password = body.newPassword;
    const updatedPassword = await user.save();
    if (!updatedPassword) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> actualizó la contraseña.";
      data.messageUSR = "No se pudo actualizar la contraseña.";
      throw new Error(data.messageDEV);
    }

    data.status = 200;
    data.messageDEV = "Se actualizo la contraseña con exito.";
    data.messageUSR = "Se actualizo la contraseña con exito.";
    bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora);
  } catch (error) {
    data.status = 400;
    data.messageDEV = error.message;
    data.messageUSR = error.message;
    bitacora = AddMSG(bitacora, data, 'FAIL', 400, true);
    return FAIL(bitacora);
  }
}

export const getMedicoById = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Buscar un medico por Id.";
    data.method = "GET";
    data.api = "/medico/" + id;
    //Buscar medico por Id
    const medico = await Medicos.findOne({ IdUsuario: id });

    const especialidad = await Catalogos.findOne({
      IdCatalogo: 2,
    });

    // Convertir a objeto plano
    let medicoWithEspecialidad = medico.toObject();

    especialidad.Valores.forEach((element) => {
      if (element.IdEspecialidad === medico.IdEspecialidad) {
        medicoWithEspecialidad.Especialidad = element;
      }
    });

    //console.log("Medico: ", medicoWithEspecialidad);

    if (!medico) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontro al medico.";
      throw Error(data.messageDEV);
    }
    data.process = "Buscar un medico por Id.";
    data.messageDEV = "Buscar un medico por Id.";
    data.messageUSR = "La busqueda del medico fue Exitosa.";
    data.dataRes = medicoWithEspecialidad;
    bitacora = AddMSG(bitacora, data, "OK", 200, true);
    return OK(bitacora);
  } catch (error) {
    console.log(error);
    if (!data.status) data.status = error.statusCode;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = message;
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
};

export const deactivateUser = async (id) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    //console.log("Id: ", id);
    bitacora.process = "Desactivar un usuario.";
    data.method = "DELETE";
    data.api = "/desactivar/" + id;
    //Desactivar usuario
    const user = await Usuarios.findOne({ IdUsuario: id });
    if (!user) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontro al usuario.";
      throw Error(data.messageDEV);
    }
    user.Activo = false;
    const deactivatedUser = await user.save();
    if (!deactivatedUser) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> desactivo al usuario.";
      throw Error(data.messageDEV);
    }
    //console.log("Usuario desactivado: ", deactivatedUser);
    data.process = "Desactivar un usuario.";
    data.messageDEV = "Desactivar un usuario.";
    data.messageUSR = "El usuario fue desactivado con exito.";
    data.dataRes = { user, respuesta: 1, mensaje: "Usuario Desactivado" };
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

export const getUserByToken = async (token) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = "Buscar un usuario por token.";
    data.method = "GET";
    data.api = "/token";

    bitacora = await authToken(bitacora, token);
    if (!bitacora.success) {
      data.status = 400;
      data.messageDEV = "Error al obtener el token.";
      data.messageUSR = "Error al obtener el token.";
      throw Error(data.messageDEV);
    }
    // console.log("bitacora: ", bitacora.data[0].dataRes.dataValues);
    let dataCount = bitacora.countData - 1;
    let userInfo = bitacora.data[dataCount].dataRes;
    let idUsuario = userInfo.IdUsuario;
    const user = await Usuarios.aggregate([
      { 
        $match: { IdUsuario: idUsuario }
      },
      {
        $lookup: {
          from: "medicos",
          localField: "IdUsuario",
          foreignField: "IdUsuario",
          as: "medicoInfo"
        }
      },
      {
        $unwind: {
          path: "$medicoInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          Password: 0
        }
      }
    ]);
    if (!user) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontro al usuario.";
      throw Error(data.messageDEV);
    }
    // console.log("user: ", user);
    data.process = "Buscar un usuario por token.";
    data.messageDEV = "Buscar un usuario por token.";
    data.messageUSR = "La busqueda del usuario fue Exitosa.";
    data.dataRes = user[0];
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

export const importUsers = async (params, token) => {
  let bitacora = BITACORA();
  let data = DATA();
  const {source, flag} = params;
  try{
    bitacora.process = "Importar usuarios.";
    data.method = "POST";
    data.api = "/importusers";
    //Abrir CSV
    const csv = require("csvtojson");
    const csvFilePath = source;
    const importedUsers = await csv().fromFile(csvFilePath);
    // console.log("Usuarios importados: ", importedUsers);
    //Mapear los usuarios
    const modifiedImportedUsers = await Promise.all(importedUsers.map(async (user) => {

      let nombreArray = [];
      let apellidoPat = '';
      let apellidoMat = '';
      let nombre = '';

      if(flag === "true"){
        nombreArray = user.Nombre.split(" ");
        apellidoPat = nombreArray[nombreArray.length - 2];
        apellidoMat = nombreArray[nombreArray.length - 1];
        nombre = nombreArray.slice(0, -2).join(" ");
      } else {
        nombre = user.nombre;
        apellidoPat = user.apellidoPat;
        apellidoMat = user.apellidoMat;
      }

      let Persona = {
        Nombre: nombre??null,
        ApPaterno: apellidoPat??null,
        ApMaterno: apellidoMat??null,
        Curp: user.Curp??null,
        Sexo: user.Sexo??null,
        Edad: user.Edad??null,
        FechaNac: user.FechaNacimiento??null,
        cat_personas_telefonos: [
          {
            NumTelefono: user.Celular??null
          }
        ],
        cat_personas_correos: [
          {
            Email: user.Email??null
          }
        ]
      }
      let Usuario = {
        Usuario: user.Login,
        Password: user.Password,
        Activo: user.Activo == "S" ? true : false,
        Foto: user.Foto??null,
        Rol: {
          IdRolOK: user.TipoUsuario,
          permisos_especiales: []
        },
        IdHospital: user.IdHospital == 2 ? 0 : user.IdHospital
      }

      let Medico = {};

      if (user.TipoUsuario === "M") {
        Medico = {
          CedulaProfesional: user.CedulaProfesional,
          IdEspecialidad: 67
        }
        return {Persona, Usuario, Medico};
      }
      
      return {Persona, Usuario};
    }));
    //Insertar usuarios y personas
    const insertedImportedUsers = await Promise.all(modifiedImportedUsers.map(async (user) => {
      const newPersona = await Personas.create(user.Persona);
      if (!newPersona) {
        data.status = 500;
        data.messageDEV = "No se pudo crear una nueva persona.";
        data.messageUSR = "No se pudo crear una nueva persona.";
        throw Error(data.messageDEV);
      }
      user.Usuario.IdPersona = newPersona.IdPersona;
      // console.log("Persona id: ", user.Usuario.IdPersona);
      const newUser = await Usuarios.create(user.Usuario);
      if (!newUser) {
        data.status = 404;
        data.messageDEV = "No se pudo crear un nuevo usuario.";
        data.messageUSR = "No se pudo crear un nuevo usuario.";
        throw Error(data.messageDEV);
      }
      // console.log("Usuario creado: ", newUser);

      if (user.Medico) {
        user.Medico.IdUsuario = newUser.IdUsuario;
        const newMedico = await Medicos.create(user.Medico);
        if (!newMedico) {
          data.status = 500;
          data.messageDEV = "No se pudo crear un nuevo Medico.";
          data.messageUSR = "No se pudo crear un nuevo Medico.";
          throw Error(data.messageDEV);
        }

        // console.log("Medico creado: ", newMedico);
        return {newPersona, newUser, newMedico};
      }

      return {newPersona, newUser};
    }));
    // console.log("Usuarios importados: ", insertedImportedUsers);
    data.process = "Importar usuarios.";
    data.messageDEV = "Importar usuarios exitoso.";
    data.messageUSR = "La importación de usuarios fue Exitosa.";
    data.dataRes = insertedImportedUsers;
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
}
export const importUsersCivil = async (params, token) => {
  let bitacora = BITACORA();
  let data = DATA();
  const {source} = params;
  try{
    bitacora.process = "Importar usuarios.";
    data.method = "POST";
    data.api = "/importuserscivil";
    //Abrir CSV
    const csv = require("csvtojson");
    const csvFilePath = source;
    const importedUsers = await csv().fromFile(csvFilePath);
    // console.log("Usuarios importados: ", importedUsers);
    const CatalogoEspecialidades = await Catalogos.findOne({ IdCatalogo: 2 });
    const especialidades = CatalogoEspecialidades.Valores;
    // console.log("Especialidades: ", especialidades);
    //Mapear los usuarios
    const modifiedImportedUsers = await Promise.all(importedUsers.map(async (user) => {
      let nombre, apellidoPat, apellidoMat, Medico;
      let nombreArray = user.U_Nombre.split(" ");
        apellidoPat = nombreArray[nombreArray.length - 2];
        apellidoMat = nombreArray[nombreArray.length - 1];
        nombre = nombreArray.slice(0, -2).join(" ");
      if(user.U_IdMedico == "0"){
        Medico = null;
      } else {
        Medico = {
          CedulaProfesional: user.M_CedulaProfesional,
          IdMedico: user.U_IdMedico,
          IdEspecialidad: especialidades.reduce((prev, curr) => {
            const regex = new RegExp(curr.Nombre, 'i');
            const matchLength = (user.M_Especialidad.match(regex) || [''])[0].length;
            return matchLength > (prev.matchLength || 0) ? { IdEspecialidad: curr.IdEspecialidad, matchLength } : prev;
          }, {}).IdEspecialidad || 0,
        }
      }
      let Persona = {
        Nombre: nombre ?? null,
        ApPaterno: apellidoPat ?? null,
        ApMaterno: apellidoMat ?? null,
        Curp: user.M_Curp ?? null,
        Sexo: user.M_Sexo??null,
        Edad: user.Edad ?? null,
        FechaNac: user.FechaNacimiento ?? null,
        cat_personas_telefonos: [
          {
        NumTelefono: user.U_Celular ?? null,
          },
        ],
        cat_personas_correos: [
          {
        Email: user.U_Email ?? null,
          },
        ],
      };
      let Usuario = {
        Usuario: user.U_Login,
        Password: user.U_Password,
        Activo: user.U_Activo == "S" ? true : false,
        Foto: user.Foto??null,
        Rol: {
          IdRolOK: user.U_TipoUsuario,
          permisos_especiales: []
        },
        IdHospital: 264
      }
      return {Persona, Usuario, Medico};
    }));
    // console.log("Usuarios modificados: ", modifiedImportedUsers);
    //Insertar usuarios y personas
    const insertedImportedUsers = await Promise.all(modifiedImportedUsers.map(async (user) => {
      const newPersona = await Personas.create(user.Persona);
      if (!newPersona) {
        data.status = 500;
        data.messageDEV = "No se pudo crear una nueva persona.";
        data.messageUSR = "No se pudo crear una nueva persona.";
        throw Error(data.messageDEV);
      }
      user.Usuario.IdPersona = newPersona.IdPersona;
      // console.log("Persona id: ", user.Usuario.IdPersona);
      const newUser = await Usuarios.create(user.Usuario);
      if (!newUser) {
        data.status = 404;
        data.messageDEV = "No se pudo crear un nuevo usuario.";
        data.messageUSR = "No se pudo crear un nuevo usuario.";
        throw Error(data.messageDEV);
      }
      // console.log("Usuario creado: ", newUser);
      let newMedico=null;
      if(user.Medico!=null){
        user.Medico.IdUsuario = newUser.IdUsuario;
        newMedico = await Medicos.create(user.Medico);
      }
      return { newPersona, newUser, newMedico};
    }));
    // console.log("Usuarios importados: ", insertedImportedUsers);
    data.process = "Importar usuarios.";
    data.messageDEV = "Importar usuarios exitoso.";
    data.messageUSR = "La importación de usuarios fue Exitosa.";
    data.dataRes = insertedImportedUsers;
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
}

export const recoverPassword = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();

  try{
    bitacora.process = "Recuperar contraseña.";
    data.method = "POST";
    data.api = "/RecuperarPassword";

    //Buscar a la persona por email
    const person = await Personas.findOne({ 
      'cat_personas_correos.Email': body.Email,
      'cat_personas_correos.detail_row.Activo': 'S'
     });
    if (!person) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontro al usuario.";
      data.messageUSR = "No se encontro el correo en la base de datos.";
      throw Error(data.messageDEV); 
    }

    let x = 0;
    //Buscar usuario por Id
    const userFound = await Usuarios.findOne({ IdPersona: person.IdPersona });
    if (!userFound) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontro al usuario.";
      data.messageUSR = "No se encontro el correo en la base de datos.";
      throw Error(data.messageDEV); 
    }

    const token = jwt.sign(
      { IdPersonaOK: person.IdPersona, 
        IdUsuarioOK: userFound.IdUsuario },
      config.JWT_SECRET,
      {
        expiresIn: 5 * 60, //5 minutos
      }
    );

    const tokenURL = encodeURIComponent(token);

    const putToken = await Usuarios.findOneAndUpdate(
      { IdUsuario: userFound.IdUsuario },
      { $set: { TokenEmail: token } },
      { new: true }
    );
    if (!putToken) {
      data.status = 404;
      data.messageDEV = "La base de datos <<NO>> encontro al usuario.";
      data.messageUSR = "No se encontro el correo en la base de datos.";
      throw Error(data.messageDEV); 
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    await transporter.sendMail({
      from: `"¿Olvidaste tu contraseña? 📧🤔 " <${config.EMAIL_USER}>`, // sender address
      to: body.Email, // list of receivers
      subject: 'Recupera tu contraseña ✔', // Subject line
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>¿Olvidaste tu contraseña?</title>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;500;700&family=Open+Sans:wght@600&display=swap"
            rel="stylesheet"
          />

          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body,
            h3 {
              color: #192229 !important;
              font-family: 'Manrope', Arial, Geneva, Tahoma, sans-serif;
              font-size: 1.25rem;
              line-height: 2;
            }
            p{
              color: #192229 !important;
              font-size: 1.125rem;
            }
            h2 {
              color: #192229 !important;
              font-size: 1.5rem;
            }
            h2,
            h3 {
              font-family: 'Open Sans', Arial, Geneva, Tahoma, sans-serif;
              font-weight: 600;
              margin: 1rem 0;
            }
            a {
              display: inline-block;
              text-decoration: none;
              color: #edeef0 !important;
              background-color: #212e36 !important;
              padding: 0.875rem;
              font-size: 1.125rem;
              border-radius: 0.25rem;
              margin: 1.25rem 0 0 0;
            }
            .separator {
              display: block;
              width: 100%;
              height: 2rem;
              background-color: #192229;
              margin: 0;
            }
            main {
              width: 100% !important;
              max-width: 35rem !important;
              background-color: #fff;
            }
            .container {
              margin: 0 2rem 2rem 2rem;
            }
            .title {
              display: inline-block;
            }
            .footer {
              width: 100%;
              background-color: #f0f2f4 !important;
              font-style: italic;
              font-size: 0.875rem !important;
            }
            .footer-container {
              padding: 1rem 2rem;
            }
            .footer-container p {
              text-align: justify;
              color: #697477 !important;
              font-size: 0.875rem !important;
            }
            .enlace {
              display: inline;
              background-color: inherit !important;
              color: #58b3f3 !important;
              font-size: 0.875rem !important;
            }
            .logo {
              width: 100% !important;
              max-width: 32rem !important;
              margin: 1rem auto !important;
              text-aling: center;
            }
          </style>
        </head>

        <body>
          <div class="separator"></div>
          <main class="main">
            <div class="container">
              <h2 class="title">Hola ${person.Nombre} ✋:</h2>
              <h3>¿Olvidaste tu contraseña?🤔</h3>
              <p>Para recuperarla da clic en el siguiente enlace 💻 :</p>
              <a href=${config.WEB_URL_PWA}/#/reestablecer-password/${userFound.IdUsuario}/${tokenURL}> Reestablecer Contraseña</a>
              <h3>
                El tiempo para cambiar tu contraseña a partir de que recibes el correo es
                de 5 minutos.
              </h3>

              <p>
                Si no solicitaste el cambio de tu contraseña, haz caso omiso a este corrreo
                y sigue disfrutando de tu día 😊✨.
              </p>
              <img class="logo" src="cid:Logo_Nayarit"/>
            </div>
          </main>
          <footer class="footer">
            <div class="footer-container">
              <p>
               La grandeza de Nayarit está en su gente, que transforma lo ordinario en extraordinario, 
               que pone el alma y el corazón en lo que hace y que va más allá de todo para hacer que 
               sucedan cosas extraordinarias. Nayarit es ese gigante dormido que aún no conocen, que 
               sus sueños, muy pronto serán realidad, vamos a despertarlo todos juntos, unidos 
               avanzamos hacia un nuevo estado.     
              </p>
            </div>
          </footer>
          <div class="separator"></div>
        </body>
      </html>`,
      attachments: [
        {
          filename: 'institucional_868x278.png',
          path: path.join(__dirname, '../utils/institucional_868x278.png'),
          cid: 'Logo_Nayarit',
        },
      ],
    });

    data.process = 'Recuperar contraseña.';
		data.messageDEV ='Se envio el correo.';
    data.messageUSR = 'Correo enviado con exito.';
		//data.dataRes = AddMovimiento;
		bitacora = AddMSG(bitacora, data, 'OK', 200, true);
		return OK(bitacora);
  }catch(error){
    if (!data.status) data.status = error.statusCode;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = message;
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, "FAIL");
    return FAIL(bitacora);
  }
}