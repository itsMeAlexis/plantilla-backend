import { Router } from "express";
import config from "../config/config.js";

import authRoutes from "./auth.routes.js";

import bdp_busquedasRoutes from "./bdp_busquedas.routes.js";

import bdp_parametrosRoutes from "./bdp_parametros.routes.js";


const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/busquedas", bdp_busquedasRoutes);

  router.use("/parametros", bdp_parametrosRoutes);

  return router;
};

export default routerAPI;
