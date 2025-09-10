import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routerAPIPWA from "./src/routes/index.routes.js";
import config from "./src/config/config.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import os from "os-utils";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// Extiende dayjs con los plugins. Haz esto una sola vez en tu app (ej. en App.js).
dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();

// import passport from "./src/config/passport.js";
const corsOrigins = config.CORS_ORIGIN.split(",");

app.set("trust proxy", true);

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
// app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.set("port", config.SERVER_PORT || 5500);
app.set("host", config.SERVER_HOST || "localhost");

const api = config.API_URL;

// Middleware para imprimir la IP del cliente y el host de la solicitud
app.use((req, res, next) => {
  const clientIp = req.ip || req.socket.remoteAddress;
  const requestHost = req.headers.host.split(":")[0];
  const serverIp = config.SERVER_HOST; // IP del servidor

  try {
    // Bloquear solicitudes no autorizadas
    if (requestHost !== serverIp) {
      return res.status(403).send("Forbidden access");
    }

    let isLogin = false;
    let isUndefined = false;

    const log = {
      Ip: clientIp,
      Route: req.originalUrl,
      Host: requestHost,
      Method: req.method,
      Date: new Date().toLocaleString(),
    };

    // Verificar si hay un token y decodificarlo
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization; // Extraer el token
        const tokenData = jwt.decode(token);

        if (tokenData) {
          log.IdUsuario = tokenData.IdUsuario;
          log.IdHospital = tokenData.IdHospital;
          log.Rol = tokenData.Rol;
        }
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }

    //console.log("Original URL:", req.originalUrl);

    //si es un login, ingresar el usuario
    if (req.originalUrl === "/api/auth/login") {
      //desencriptar credenciales y guardar usuario
      const credentials = Buffer.from(req.body.credentials, "base64").toString(
        "utf8"
      );
      const [Login, Password] = credentials.split(":");
      log.User = Login;

      isLogin = true;
    }

    if (!log.IdHospital) {
      isUndefined = true;
    }

    let route = "";

    // Ruta del archivo de log con la carpeta del hospital dinámica
    if (isUndefined && !isLogin) {
      route = "otros";
    } else {
      route = `${isLogin ? "logins" : log.IdHospital}`;
    }

    console.log("Log:", req.originalUrl);
    os.cpuUsage(function (v) {
      if (v > 0.5) {
        console.log("CPU Usage (%): " + v * 100);
      }
    });

    /*const logDir = path.join(__dirname, `src/logs/${route}`);
    const logFile = path.join(
      logDir,
      `${new Date().toISOString().split("T")[0]}.log`
    );*/
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Obtén la ruta base desde la variable de entorno o usa la ruta interna
    const baseLogDir = process.env.LOG_DIRECTORY
      ? path.resolve(process.env.LOG_DIRECTORY)
      : path.join(__dirname, "src", "logs");

    // Ahora combina la base con la ruta específica que necesites
    const logDir = path.join(baseLogDir, route);

    // Y el archivo log
    const logFile = path.join(
      logDir,
      `${new Date().toISOString().split("T")[0]}.log`
    );

    try {
      // Verificar si la carpeta existe, si no, crearla
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true }); // Crea la carpeta de manera recursiva
        console.log(`Carpeta creada: ${logDir}`);
      }

      let logs = { logs: [] };

      // Si el archivo de log existe, leerlo
      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, "utf8").trim();

        if (content) {
          try {
            logs = JSON.parse(content);

            // Verificar si la estructura es válida
            if (!Array.isArray(logs.logs)) {
              logs = { logs: [] }; // Reiniciar si la estructura no es válida
            }
          } catch (error) {
            console.error("Error al parsear JSON, reinicializando log:", error);
            logs = { logs: [] }; // Reiniciar en caso de error de parsing
          }
        }
      }

      // Agregar el nuevo log
      logs.logs.push(log);

      // Guardar en el archivo de log
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
      //console.log("Log guardado:", log);
    } catch (error) {
      console.error("Error al escribir el log:", error);
    }

    next();
  } catch (error) {
    console.error("Error en el middleware de log:", error);
    return res.status(500).send("Internal server error");
  }
});

app.get("/", (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress;
  res.send(`API funcionando correctamente en ${api} - IP Cliente: ${clientIp}`);
});

app.get("/api", (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress;
  res.send(`API funcionando correctamente en ${api} - IP Cliente: ${clientIp}`);
});

// Routes
routerAPIPWA(app);

export default app;
