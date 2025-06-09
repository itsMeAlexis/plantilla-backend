import { Router } from "express";

//GRX: Config para variables de entorno
import config from "../config/config.js";


//GRX: auth Collections
import authRoutes from "./auth.routes.js";

import bdp_busquedasRoutes from "./bdp_busquedas.routes.js";


const routerAPI = (app) => {
  const router = Router();

  const api = config.API_URL;

  app.use(api, router);

  router.use("/auth", authRoutes);

  router.use("/busquedas", bdp_busquedasRoutes);

  return router;
};

export default routerAPI;
