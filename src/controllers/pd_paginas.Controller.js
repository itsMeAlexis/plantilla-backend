import * as paginasServices from '../services/pd_paginas.Services.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export const getAllPaginas = async (req, res, next) => {
    try {
        const getAllPaginas = await paginasServices.getAllPaginas();
        if (getAllPaginas) {
            return res.status(getAllPaginas.status).json(getAllPaginas);
        }
    } catch (error) {
        next(error);
    }
}