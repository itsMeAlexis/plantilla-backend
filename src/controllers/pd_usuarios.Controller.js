import * as usuariosServices from '../services/pd_usuarios.Services.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const createUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // if(jwt.verify(token, config.JWT_SECRET_KEY)){
        //     return res.status(403).json({ message: 'No autorizado' });
        // }
        const createUser = await usuariosServices.createUser(req.body);
        if (createUser) {
            return res.status(createUser.status).json(createUser);
        }
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const getAllUsers = await usuariosServices.getAllUsers();
        if (getAllUsers) {
            return res.status(getAllUsers.status).json(getAllUsers);
        }
    } catch (error) {
        next(error);
    }
}
 
export const getUserById = async (req, res, next) => {
    try {
        const getUserById = await usuariosServices.getUserById(req.params.IdUsuario);
        if (getUserById) {
            return res.status(getUserById.status).json(getUserById);
        }
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const updateUser = await usuariosServices.updateUser(req.body, req.params.IdUsuario);
        if (updateUser) {
            return res.status(updateUser.status).json(updateUser);
        }
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    console.log("Llega a updateProfile controller");
    const tokenData = jwt.decode(req.body.token);
    console.log("Token data decoded:", tokenData);
    try {
        const updateProfile = await usuariosServices.updateProfile(req.body, tokenData.id_usuario);
        if (updateProfile) {
            return res.status(updateProfile.status).json(updateProfile);
        }
    } catch (error) {
        next(error);
    }
}

export const changeUserStatus = async (req, res, next) => {
    try {
        const changeUserStatus = await usuariosServices.changeUserStatus(req.params.IdUsuario);
        if (changeUserStatus) {
            return res.status(changeUserStatus.status).json(changeUserStatus);
        }
    } catch (error) {
        next(error);
    }
}



// ---------------------------------    |
// Controladores que ya estaban antes   V






export const changePassword = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const changedPassword = await authController.changePassword(req.body, token);
        if (changedPassword) {
            return res.status(changedPassword.status).json(changedPassword);
        }
    } catch (error) {
        next(error);
    }
}

export const recoverPassword = async (req, res, next) => {
    try {
        const recoverPassword = await authController.recoverPassword(req.query);
        if (recoverPassword) {
            return res.status(recoverPassword.status).json(recoverPassword);
        }
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // el token puede o no contener la palabra Bearer
        let tokenSinBearer = token;
        if (token.startsWith("Bearer ")) {
            tokenSinBearer = token.slice(7, token.length);
        }
        const resetPassword = await authController.resetPassword(req.params.IdUsuario, req.body, tokenSinBearer);
        if (resetPassword) {
            return res.status(resetPassword.status).json(resetPassword);
        }
    } catch (error) {
        next(error);
    }
}

export const sendEmailPassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // el token puede o no contener la palabra Bearer
        let tokenSinBearer = token;
        if (token.startsWith("Bearer ")) {
            tokenSinBearer = token.slice(7, token.length);
        }
        const sendEmailPassword = await authController.sendEmailPassword(req.body, tokenSinBearer);
        if (sendEmailPassword) {
            return res.status(sendEmailPassword.status).json(sendEmailPassword);
        }
    } catch (error) {
        next(error);
    }
}

export const returnServerVersion = async (req, res, next) => {
    try {
        const version = await authController.returnServerVersion();
        if (version) {
            return res.status(200).json(version);
        }
    } catch (error) {
        next(error);
    }
}