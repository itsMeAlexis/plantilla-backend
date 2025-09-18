import * as rolesServices from '../services/pd_roles.Services.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export const getAllRoles = async (req, res, next) => {
    try {
        const getAllRoles = await rolesServices.getAllRoles();
        if (getAllRoles) {
            return res.status(getAllRoles.status).json(getAllRoles);
        }
    } catch (error) {
        next(error);
    }
}

export const getAllRolesWithAdditionalInfo = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const getAllRoles = await rolesServices.getAllRolesWithAdditionalInfo(token, req.query);
        if (getAllRoles) {
            return res.status(getAllRoles.status).json(getAllRoles);
        }
    } catch (error) {
        next(error);
    }
}
