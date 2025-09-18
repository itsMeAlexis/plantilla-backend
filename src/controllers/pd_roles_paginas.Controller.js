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

export const createRolesPaginas = async (req, res, next) => {
    try {
        const createNewRolesPaginas = await roles_paginasServices.createRolesPaginas(req.body);
        if (createNewRolesPaginas) {
            return res.status(createNewRolesPaginas.status).json(createNewRolesPaginas);
        }
    } catch (error) {
        next(error);
    }
}
export const updateRolesPaginas = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateRolesPaginas = await roles_paginasServices.updateRolesPaginas(id, req.body);
        if (updateRolesPaginas) {
            return res.status(updateRolesPaginas.status).json(updateRolesPaginas);
        }
    } catch (error) {
        next(error);
    }
}