import { Router } from "express";
import config from "../config/config.js";

import authRoutes from "./auth.routes.js";

import usuariosRoutes from "./pd_usuarios.routes.js";

import bdp_parametrosRoutes from "./bdp_parametros.routes.js";

import bdp_nacionalidadesRoutes from "./bdp_cat_nacionalidades.routes.js";

import bdp_edo_civil from "./bdp_edo_civil.routes.js";


const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/usuarios", usuariosRoutes);

  router.use("/parametros", bdp_parametrosRoutes);

  router.use("/nacionalidades", bdp_nacionalidadesRoutes);

  router.use("/edocivil", bdp_edo_civil);

  return router;
};

export default routerAPI;
