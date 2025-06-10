import { Router } from "express";
import config from "../config/config.js";

import authRoutes from "./auth.routes.js";

import bdp_busquedasRoutes from "./bdp_busquedas.routes.js";

import bdp_parametrosRoutes from "./bdp_parametros.routes.js";

import bdp_reg_victimasRoutes from "./bdp_reg_victimas.routes.js";


const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/busquedas", bdp_busquedasRoutes);

  router.use("/parametros", bdp_parametrosRoutes);

  router.use("/regvictimas", bdp_reg_victimasRoutes);

  return router;
};

export default routerAPI;
