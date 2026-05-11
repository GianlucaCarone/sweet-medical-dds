import express from "express"; // framework para crear el servidor y manejar las rutas
import cors from "cors"; // middleware para permitir solicitudes desde diferentes orígenes (CORS)
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { Server } from "./server.js";
import routes from "./routes/router.js";
import { SedeController } from "./controllers/SedeController.js";
import { TurnoController } from "./controllers/TurnoController.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

const server = new Server(app);

const sedeController = new SedeController();
server.setController(SedeController, sedeController);

const turnoController = new TurnoController();
server.setController(TurnoController, turnoController);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach(ruta => server.addRoute(ruta));
server.configurarRutas();

export default server;