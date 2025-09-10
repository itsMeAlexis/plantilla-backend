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

export const updateUser = async (req, res, next) => {
    try {
        const updateUser = await authController.updateUser(req.body);
        if (updateUser) {
            return res.status(201).json(updateUser);
        }
    } catch (error) {
        next(error);
    }
}

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