import { Router } from "express";
import config from "../config/config.js";

import authRoutes from "./auth.routes.js";

import usuariosRoutes from "./pd_usuarios.routes.js";

import rolesRoutes from "./pd_roles.routes.js";

const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/usuarios", usuariosRoutes);

  router.use("/roles", rolesRoutes);

  return router;
};

export default routerAPI;
