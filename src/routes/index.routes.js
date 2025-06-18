import { Router } from "express";
import config from "../config/config.js";

import authRoutes from "./auth.routes.js";

import bdp_busquedasRoutes from "./bdp_busquedas.routes.js";

import bdp_parametrosRoutes from "./bdp_parametros.routes.js";

import bdp_reg_victimasRoutes from "./bdp_reg_victimas.routes.js";

import bdp_prereg_victimasRoutes from "./bdp_prereg_victimas.routes.js";

import bdp_nacionalidadesRoutes from "./bdp_cat_nacionalidades.routes.js";

import bdp_edo_civil from "./bdp_edo_civil.routes.js";

import bdp_cat_escolaridadesRoutes from "./bdp_cat_escolaridades.routes.js";

import bdp_colectivos from "./bdp_colectivos.routes.js";


const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/busquedas", bdp_busquedasRoutes);

  router.use("/parametros", bdp_parametrosRoutes);

  router.use("/regvictimas", bdp_reg_victimasRoutes);

  router.use("/preregvictimas", bdp_prereg_victimasRoutes);

  router.use("/nacionalidades", bdp_nacionalidadesRoutes);

  router.use("/edocivil", bdp_edo_civil);

  router.use("/escolaridades", bdp_cat_escolaridadesRoutes);

  router.use("/colectivos", bdp_colectivos);

  return router;
};

export default routerAPI;
