import * as roles_paginasServices from '../services/pd_roles_paginas.Services.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export const getAllRolesPaginasByIdRol = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getAllRolesPaginas = await roles_paginasServices.getAllRolesPaginasByIdRol(id, req.query);
        if (getAllRolesPaginas) {
            return res.status(getAllRolesPaginas.status).json(getAllRolesPaginas);
        }
    } catch (error) {
        next(error);
    }
}