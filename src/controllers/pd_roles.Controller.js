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