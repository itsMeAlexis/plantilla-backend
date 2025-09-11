import * as authController from '../services/auth.Services.js';

export const login = async (req, res, next) => {
    try {
        const login = await authController.login(req.body);
        if (login) {
            return res.status(login.status).json(login);
        }
    } catch (error) {
        next(error);
    }
};

export const validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const login = await authController.validateToken(token);
        if (login) {
            return res.status(200).json(login);
        }
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(jwt.verify(token, config.JWT_SECRET_KEY)){
            return res.status(403).json({ message: 'No autorizado' });
        }
        const register = await authController.register(req.body);
        if (register) {
            return res.status(register.status).json(register);
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