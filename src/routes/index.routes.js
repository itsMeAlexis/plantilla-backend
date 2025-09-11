import { Router } from "express";
import config from "../config/config.js";

import authRoutes from "./auth.routes.js";

import usuariosRoutes from "./pd_usuarios.routes.js";


const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/usuarios", usuariosRoutes);

  return router;
};

export default routerAPI;
