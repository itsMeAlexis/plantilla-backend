import { pd_usuarios, pd_roles, pd_roles_paginas, pd_paginas } from '../models/associations.js';
import { BITACORA, DATA, OK, AddMSG, FAIL } from '../middleware/respPWA.handler.js';
import { generateToken } from '../config/jwt.js'; 
import config from "../config/config.js";
import { transporter } from '../config/nodemailer.js';
import path from 'path';
import jwt from 'jsonwebtoken';

export const register = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
      bitacora.process = "Registrar un nuevo usuario.";
      data.method = "POST";
      data.api = "/";

      const user = await pd_usuarios.create(body);
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

export const login = async (body) => {
  let bitacora = BITACORA();
  let data = DATA();
  const intentos = 5;
  const credentials = Buffer.from(body.credentials, "base64").toString("utf8");
  console.log(credentials)
  const [Login, Password, loggedAt] = credentials.split(":");

  try {
    bitacora.process = 'Inicio de sesion';
    data.method = 'POST';
    data.api = '/login';

    // Buscar el usuario por su login
    const usuario = await pd_usuarios.findOne({ 
      where: { usuario: Login },
      include: [
        {
          model: pd_roles,
          include:[
            { model: pd_roles_paginas,
              include: [
                { 
                  model: pd_paginas
                }
              ]
            }
          ]
        },
      ]
    });
    if (!usuario) {
      console.log("Inicio de sesion invalido, fecha y hora: "+new Date(),`\nLogin: ${Login} Password: ${Password}`);
      data.status = 400;
      data.messageDEV = "Contraseña incorrecta / Usuario no encontrado.";
      data.messageUSR = "Contraseña incorrecta / Usuario no encontrado.";
      throw Error(data.messageDEV);
    }
    // console.log(usuario.dataValues.PD_ROLE.PD_ROLES_PAGINAs);
    

    if (!usuario.activo) {
      console.log("Inicio de sesion invalido, fecha y hora: "+new Date(),`\nLogin: ${Login} Password: ${Password}`);
      data.status = 400;
      data.messageDEV = "El usuario esta desactivado.";
      data.messageUSR = "El usuario ha sido bloqueado o deshabilitado. Por favor, póngase en contacto con el administrador de su unidad.";
      throw Error(data.messageDEV);
    }

    const isMatch = await usuario.validarContrasena(Password);

    if (!isMatch) {
      console.log("Inicio de sesión inválido", {
        timestamp: new Date().toISOString(),
        login: Login,
        reason: "Contraseña incorrecta"
      });
      
      usuario.num_intentos += 1;
      
      // Bloquear el usuario si excede el número de intentos permitidos
      if(usuario.num_intentos > intentos) {
        usuario.activo = false;
        console.log(`Usuario ${Login} bloqueado por exceder ${intentos} intentos fallidos`);
      }
      
      // Actualizar el numero de intentos
      await usuario.save();

      data.status = 400;
      data.messageDEV = "Contraseña incorrecta / Usuario no encontrado.";
      data.messageUSR = "Contraseña incorrecta / Usuario no encontrado.";
      throw Error(data.messageDEV);
    } else {
      // Login exitoso - resetear intentos fallidos si los había
      if (usuario.num_intentos > 0) {
        usuario.num_intentos = 0;
        await usuario.save();
      }
    }
    const authorizedPages = usuario.dataValues.PD_ROLE.PD_ROLES_PAGINAs
      .map(rp => ({
      path: rp.dataValues.PD_PAGINA?.path,
      descripcion: rp.dataValues.PD_PAGINA?.descripcion,
      prioridad: rp.dataValues.PD_PAGINA?.prioridad
      }))
      .sort((a, b) => a.prioridad - b.prioridad);
    console.log(authorizedPages)
    // userData para el token
    let userData = {
      id_usuario: usuario?.id_usuario,
      usuario: usuario?.usuario,
      nombre: usuario?.nombre,
      appaterno: usuario?.appaterno,
      apmaterno: usuario?.apmaterno,
      cambio_password: usuario?.cambio_password,
      rol: usuario?.PD_ROLE?.letra_rol,
      authorizedPages
    }
    //Generar token
    // const token = jwt.sign(
    //   userData,
    //   config.JWT_SECRET_KEY,
    //   { expiresIn: "8h" }
    // );
    const token = generateToken({user: userData, expiresIn: "8h"});

    // Eliminar id_usuario del userData
    delete userData.id_usuario;
    //const decode = jwt.verify(token, process.env.JWT_SECRET);
   // console.log(decode);

    data.process = 'Inicio de sesion';
		data.messageDEV ='El inicio de sesion fue exitoso.';
    data.messageUSR = 'El inicio de sesion fue exitoso.';
		data.dataRes = { token, userData, loggedAt };
		bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora);
	} catch (error) {
		if (!data.status) data.status = error.statusCode;
		let { message } = error;
		if (!data.messageDEV) data.messageDEV = message;
		if (!data.messageUSR) data.messageUSR = message;
		if (data.dataRes.length === 0) data.dataRes = error;
		bitacora = AddMSG(bitacora, data, 'FAIL');
		return FAIL(bitacora);
	}
};

export const validateToken = async (token) => {
  let bitacora = BITACORA();
  let data = DATA();
  try {
    bitacora.process = 'Validar el token del usuario.';
    data.method = "GET";
    data.api = "/validate-token";
    const decoded = jwt.decode(token, config.JWT_SECRET_KEY);
    if (!decoded) {
      data.status = 403;
      data.process = 'Validar el token del usuario.';
      data.messageDEV ='Token inválido';
      data.messageUSR = 'Token inválido';
    }
    const userInfo = await pd_usuarios.findOne({
      where: { id_usuario: decoded.id_usuario },
      include: [
        {
          model: pd_roles,
          include: [
            {
              model: pd_roles_paginas,
              include: [
                { 
                  model: pd_paginas
                }
              ]
            }
          ]
        },
      ]
    });
    if (!userInfo) {
      data.status = 403;
      data.process = 'Validar el token del usuario.';
      data.messageDEV ='Token inválido';
      data.messageUSR = 'Token inválido';
    }
    if (!userInfo.activo) {
      data.status = 403;
      data.process = 'Validar el token del usuario.';
      data.messageDEV ='Token inválido';
      data.messageUSR = 'Token inválido';
    }
    const authorizedPages = userInfo.dataValues.PD_ROLE.PD_ROLES_PAGINAs
      .map(rp => ({
        path: rp.dataValues.PD_PAGINA?.path,
        descripcion: rp.dataValues.PD_PAGINA?.descripcion,
        prioridad: rp.dataValues.PD_PAGINA?.prioridad
      }))
      .sort((a, b) => a.prioridad - b.prioridad);
    const userData = {
      id_usuario: userInfo.id_usuario,
      usuario: userInfo.usuario,
      nombre: userInfo.nombre,
      appaterno: userInfo.appaterno,
      apmaterno: userInfo.apmaterno,
      cambio_password: userInfo.cambio_password,
      rol: userInfo.PD_ROLE?.letra_rol,
      authorizedPages
    };

    // 🔄 GENERAR NUEVO TOKEN (esto es lo que faltaba!)
    const newToken = generateToken({user: userData, expiresIn: "8h"});
    
    // Eliminar id_usuario del userData que se devuelve
    delete userData.id_usuario;

    data.process = 'Validar el token del usuario.';
    data.messageDEV ='El token es valido y se ha renovado.';
    data.messageUSR = 'El token es valido y se ha renovado.';
    data.dataRes = {userData, token: newToken}; // ← Devolver el NUEVO token
    bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora)
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = message;
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, 'FAIL');
    return FAIL(bitacora);
  }
}

export const updateUser = async (req, res) => {
  try {
    //console.log("Creando Nuevo Usuario");

    await Usuarios.update(
      {
        nombre: req.body.nombre,
        correo: req.body.correo,
      },
      {
        where: {
          id_usuario: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "Se edito el usuario con exito",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al editar usuario", error });
  }
};


export const authToken = async (bitacora,token) => {
	let data = DATA();	
  
  try {
    bitacora.process = 'Obtener el id del hospital con el token del usuario.';
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded:", decoded);

    let x=0;
    const IdHospital = await Usuarios.findOne({"IdUsuario": decoded.IdUsuario});
    if (!IdHospital) {
      data.process = "Registrar un medicamento.";
      data.messageDEV = "No se encontró el hospital del usuario.";
      data.messageUSR = "No se encontró el hospital del usuario.";
      throw Error(data.messageDEV);
    }

    data.process = 'Obtener el id del hospital con el token.';
		data.messageDEV ='Se obtuvo el id del hospital.';
    data.messageUSR = 'Se obtuvo el id del hospital.';
		data.dataRes = IdHospital;
		bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora)
	} catch (error) {
		if (!data.status) data.status = error.statusCode;
		let { message } = error;
		if (!data.messageDEV) data.messageDEV = message;
		if (!data.messageUSR) data.messageUSR = message;
		if (data.dataRes.length === 0) data.dataRes = error;
		bitacora = AddMSG(bitacora, data, 'FAIL');
		return FAIL(bitacora);
	}
}

export const changePassword = async (body, token) => {
  let bitacora = BITACORA();
  let data = DATA();
  const { NewPassword, NewConfirmPassword } = body;
  try {
    bitacora.process = 'Cambiar la contraseña del usuario a una nueva.';
    data.method = "PUT";
    data.api = "/change-password";

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    if (!decoded) {
      data.process = "Validar el token.";
      data.messageDEV = "Token inválido.";
      data.messageUSR = "Token inválido.";
      throw Error(data.messageDEV);
    }
    const usuario = await pd_usuarios.findOne({ 
      where: { 
        id_usuario: decoded.id_usuario,
        cambio_password: true
       },
    });
    if (!usuario) {
      data.process = "Encontrar el usuario.";
      data.messageDEV = "No se encontró el usuario.";
      data.messageUSR = "No se encontró el usuario.";
      throw Error(data.messageDEV);
    }
    if (NewPassword !== NewConfirmPassword){
      bitacora.process = "Las contraseñas no coinciden.";
      data.messageDEV = "Las contraseñas no coinciden.";
      data.messageUSR = "Las contraseñas no coinciden.";
      throw Error(data.messageDEV);
    }
    usuario.password = NewPassword;
    usuario.cambio_password = false;
    const updatedUserPassword = await usuario.save();
    if (!updatedUserPassword) {
      bitacora.process = "Error al actualizar la contraseña.";
      data.messageDEV = "Error al actualizar la contraseña.";
      data.messageUSR = "Error al actualizar la contraseña.";
      throw Error(data.messageDEV);
    }
    bitacora.process = 'Cambiar la contraseña del usuario a una nueva.';
    bitacora.messageDEV = "Cambio de contraseña exitoso.";
    bitacora.messageUSR = "Cambio de contraseña exitoso.";
		data.dataRes = { userData:updatedUserPassword?.usuario };
		bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora)
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
		let { message } = error;
		if (!data.messageDEV) data.messageDEV = message;
		if (!data.messageUSR) data.messageUSR = message;
		if (data.dataRes.length === 0) data.dataRes = error;
		bitacora = AddMSG(bitacora, data, 'FAIL');
		return FAIL(bitacora);
  }
};

export const recoverPassword = async (query) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = 'Recuperar la contraseña del usuario.';
    data.method = "PUT";
    data.api = "/forgot-password-change";

    //------------------------------------------------------------------------
		//GRX: Validar el token.
		//........................................................................
		const token = decodeURIComponent(query.Token); 
		jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
			if (err) {
				data.status = 400;
				data.messageDEV = 'Token Caducado.';
				data.messageUSR = 'Este enlace ha expirado o ha sido caducado.';
				throw Error(data.messageDEV);
			}
		});

    //------------------------------------------------------------------------
    //GRX: Buscar el usuario.
    //........................................................................
    const user = await Usuarios.findOne({IdUsuario: query.IdUsuario});
    if (!user) {
      data.status = 400;
      data.process = "Encontrar el usuario.";
      data.messageDEV = "No se encontró el usuario.";
      data.messageUSR = "No se encontró el usuario.";
      throw Error(data.messageDEV);
    }

    //------------------------------------------------------------------------
    //GRX: Validar el token.
    //........................................................................
    let x = 0;
    if (user.TokenEmail !== token) {
      data.status = 400;
      data.process = "Actualizar la contraseña del usuario.";
      data.messageDEV = "El token es incorrecto.";
      data.messageUSR = "Este usuario no solicitó un cambio de contraseña.";
      throw Error(data.messageDEV);
    }

    user.TokenEmail = "";
    user.Password = query.Password;

    //------------------------------------------------------------------------
    //GRX: Actualizar la contraseña.
    //........................................................................
    const updatedPassword = await user.save();
    if (!updatedPassword) {
      data.status = 400;
      data.process = "Actualizar la contraseña del usuario.";
      data.messageDEV = "Error al actualizar la contraseña del usuario.";
      data.messageUSR = "Error al actualizar la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    data.process = "Recuperar la contraseña del usuario.";
    data.messageDEV = "Se recuperó la contraseña del usuario.";
    data.messageUSR = "Se cambió la contraseña con exito.";
    //data.dataRes = {  };
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

export const resetPassword = async (IdUsuario, body, token) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = "Reestablecer la contraseña del usuario.";
    data.method = "PUT";
    data.api = "/reset-password/";

    //GRX: obtener userInfo con el token
    bitacora = await authToken(bitacora, token);
    if (!bitacora.success) {
      data.status = 400;
      data.messageDEV = "Error al obtener el token.";
      data.messageUSR = "Error al obtener el token.";
      throw Error(data.messageDEV);
    }

    let dataCount = bitacora.countData - 1;
    let userInfo = bitacora.data[dataCount].dataRes;
    let x = 0;

    if (userInfo.Rol.IdRolOK !== "R" && userInfo.Rol.IdRolOK !== "A" && userInfo.Rol.IdRolOK !== "AAE" && userInfo.Rol.IdRolOK !== "AJ") {
      data.status = 403;
      data.messageDEV = "Este usuario no tiene permiso para reestablecer la contraseña del usuario.";
      data.messageUSR = "Este usuario no tiene permiso para reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: buscar usuario
    const user = await Usuarios.findOne({ IdUsuario: IdUsuario });
    if (!user) {
      data.status = 400;
      data.messageDEV = "No se encontró el usuario.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: validar usuario
    if (body.IdUsuario !== user.IdUsuario) {
      data.status = 400;
      data.messageDEV = "No coincide el usuario seleccionado.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: buscar persona
    const persona = await Persona.findOne({ IdPersona: user.IdPersona });
    if (!persona) {
      data.status = 400;
      data.messageDEV = "No se encontró la persona.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    if (persona.cat_personas_correos.length === 0) {
      data.status = 400;
      data.messageDEV = "El usuario no tiene un correo.";
      data.messageUSR = "El usuario no tiene un correo.";
      throw Error(data.messageDEV);
    }

    //GRX: ver si hay un correo registrado
    let correoEncontrado = "";
    correoEncontrado = persona.cat_personas_correos.find(correos => correos.detail_row.Activo === "S" && correos.Email)?.Email;

    if (!correoEncontrado) {
      data.status = 400;
      data.messageDEV = "El usuario no tiene un correo activo.";
      data.messageUSR = "El usuario no tiene un correo activo.";
      throw Error(data.messageDEV);
    }
    
    //GRX: generar contraseña aleatoria
    const pass = generarContrasenaAleatoria();

    user.Password = "TEMP" + pass;

    //GRX: mandar correo
    await transporter.sendMail({
      from: `"¿Olvidaste tu contraseña? 📧🤔 " <${config.EMAIL_USER}>`, // sender address
      to: correoEncontrado, // list of receivers
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
              <h2 class="title">Hola ${persona.Nombre} ✋:</h2>
              <h3>¿Olvidaste tu contraseña?🤔</h3>
              <p>El administrador del sistema te ha reestablecido tu contraseña 💻 :</p>
              <a> Tu contraseña es: ${user.Password}</a>
              <h3>
                Solo tu tienes conocimiento de esta contraseña. Recuerda no compartirla con nadie.
              </h3>

              <p>
                Si no solicitaste el cambio de tu contraseña, Contacta a tu administrador del sistema.
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

    user.CambioPassword = true;
    user.Activo = true;
    //GRX: actualizo la contraseña del usuario
    const updatedPassword = await user.save();
    if (!updatedPassword) {
      data.status = 400;
      data.messageDEV = "Error al actualizar la contraseña del usuario.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    bitacora.process = 'Reestablecer la contraseña del usuario.';
    bitacora.messageDEV = "Se reestablecio la contraseña del usuario.";
    bitacora.messageUSR = "Se reestablecio la contraseña del usuario.";
		data.dataRes = "";
		bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora)
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
		let { message } = error;
		if (!data.messageDEV) data.messageDEV = message;
		if (!data.messageUSR) data.messageUSR = message;
		if (data.dataRes.length === 0) data.dataRes = error;
		bitacora = AddMSG(bitacora, data, 'FAIL');
		return FAIL(bitacora);
  }
};

export const sendEmailPassword = async (body, token) => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = "Reestablecer la contraseña del usuario.";
    data.method = "PUT";
    data.api = "/reset-password/";

    //GRX: obtener userInfo con el token
    bitacora = await authToken(bitacora, token);
    if (!bitacora.success) {
      data.status = 400;
      data.messageDEV = "Error al obtener el token.";
      data.messageUSR = "Error al obtener el token.";
      throw Error(data.messageDEV);
    }

    let dataCount = bitacora.countData - 1;
    let userInfo = bitacora.data[dataCount].dataRes;
    let x = 0;

    if (userInfo.Rol.IdRolOK !== "R" && userInfo.Rol.IdRolOK !== "A" && userInfo.Rol.IdRolOK !== "AAE" && userInfo.Rol.IdRolOK !== "AJ") {
      data.status = 403;
      data.messageDEV = "Este usuario no tiene permiso para reestablecer la contraseña del usuario.";
      data.messageUSR = "Este usuario no tiene permiso para reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: validar usuario
    if (body.userActual !== userInfo.IdUsuario) {
      data.status = 400;
      data.messageDEV = "No coincide el usuario seleccionado.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: Buscar el usuario.
    const user = await Usuarios.findOne({ IdUsuario: body.userSelected });
    if (!user) {
      data.status = 400;
      data.messageDEV = "No se encontró el usuario.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: Buscar persona.
    const persona = await Persona.findOne({ IdPersona: user.IdPersona });
    if (!persona) {
      data.status = 400;
      data.messageDEV = "No se encontró el personal.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    if (persona.cat_personas_correos.length === 0) {
      persona.cat_personas_correos.push({
        Email: body.correo,
      });
    }else{
      //GRX: ver si hay un correo registrado
      let correoEncontrado = "";
      correoEncontrado = persona.cat_personas_correos.find(correos => correos.detail_row.Activo === "S");
      correoEncontrado.Email = body.correo;
    }

    //GRX: Actualizar persona
    const updatedPersona = await persona.save();
    if (!updatedPersona) {
      data.status = 400;
      data.messageDEV = "Error al actualizar la persona.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    //GRX: generar constraaseña nueva
    const pass = generarContrasenaAleatoria();

    user.Password = "TEMP" + pass;
    user.CambioPassword = true;
    user.Activo = true;

    //GRX: mandar correo
    await transporter.sendMail({
      from: `"¿Olvidaste tu contraseña? 📧🤔 " <${config.EMAIL_USER}>`, // sender address
      to: body.correo, // list of receivers
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
              <h2 class="title">Hola ${persona.Nombre} ✋:</h2>
              <h3>¿Olvidaste tu contraseña?🤔</h3>
              <p>El administrador del sistema te ha reestablecido tu contraseña 💻 :</p>
              <a> Tu contraseña es: ${user.Password}</a>
              <h3>
                Solo tu tienes conocimiento de esta contraseña. Recuerda no compartirla con nadie.
              </h3>

              <p>
                Si no solicitaste el cambio de tu contraseña, Contacta a tu administrador del sistema.
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

    //GRX: Actualizar usuario
    const updatedUser = await user.save();
    if (!updatedUser) {
      data.status = 400;
      data.messageDEV = "Error al actualizar el usuario.";
      data.messageUSR = "Error al reestablecer la contraseña del usuario.";
      throw Error(data.messageDEV);
    }

    bitacora.process = 'Reestablecer la contraseña del usuario.';
    bitacora.messageDEV = "Se reestablecio la contraseña del usuario.";
    bitacora.messageUSR = "Se reestablecio la contraseña del usuario.";
		data.dataRes = "";
		bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora)
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
		let { message } = error;
		if (!data.messageDEV) data.messageDEV = message;
		if (!data.messageUSR) data.messageUSR = message;
		if (data.dataRes.length === 0) data.dataRes = error;
		bitacora = AddMSG(bitacora, data, 'FAIL');
		return FAIL(bitacora);
  }
};

export const returnServerVersion = async () => {
  let bitacora = BITACORA();
  let data = DATA();

  try {
    bitacora.process = 'Obtener la version del servidor.';
    data.method = 'GET';
    data.api = '/version';

    data.process = 'Obtener la version del servidor.';
    data.messageDEV = 'Version del servidor obtenida.';
    data.messageUSR = 'Version del servidor obtenida.';
    data.dataRes = { version: process.env.v };
    bitacora = AddMSG(bitacora, data, 'OK', 200, true);
    return OK(bitacora);
  } catch (error) {
    if (!data.status) data.status = error.statusCode;
    let { message } = error;
    if (!data.messageDEV) data.messageDEV = message;
    if (!data.messageUSR) data.messageUSR = message;
    if (data.dataRes.length === 0) data.dataRes = error;
    bitacora = AddMSG(bitacora, data, 'FAIL');
    return FAIL(bitacora);
  }
};


///////////////////////////////////////////////////////////////

// Helper functions para mejorar la legibilidad del código de autenticación

/**
 * Maneja los intentos fallidos de login
 * @param {Object} usuario - El objeto usuario de la base de datos
 * @param {string} login - El login del usuario
 * @param {number} maxIntentos - Número máximo de intentos permitidos
 */
function handleFailedLoginAttempt(usuario, login, maxIntentos) {
  usuario.num_intentos += 1;
  
  if (usuario.num_intentos > maxIntentos) {
    usuario.activo = false;
    console.log(`Usuario ${login} bloqueado por exceder ${maxIntentos} intentos fallidos`);
  }
  
  return usuario.save();
}

/**
 * Registra información estructurada de intentos de login fallidos
 * @param {string} login - El login del usuario
 * @param {string} reason - La razón del fallo
 */
function logFailedLogin(login, reason) {
  console.log("Inicio de sesión inválido", {
    timestamp: new Date().toISOString(),
    login: login,
    reason: reason
  });
}

/**
 * Resetea los intentos fallidos de un usuario después de un login exitoso
 * @param {Object} usuario - El objeto usuario de la base de datos
 */
async function resetFailedAttempts(usuario) {
  if (usuario.num_intentos > 0) {
    usuario.num_intentos = 0;
    await usuario.save();
  }
}

function generarContrasenaAleatoria() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contrasena = '';
  for (let i = 0; i < 4; i++) {
    contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contrasena;
}