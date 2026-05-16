import express from "express"; // framework para crear el servidor y manejar las rutas
import cors from "cors"; // middleware para permitir solicitudes desde diferentes orígenes (CORS)
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { zodErrorHandler } from "./middlewares/zodErrorHandler.js";
import { Server } from "./server.js";
import routes from "./routes/router.js";
import { SedeController } from "./controllers/SedeController.js";
import { TurnoController } from "./controllers/TurnoController.js";
import { ObraSocialController } from "./controllers/ObraSocialController.js"; import { UsuarioController } from "./controllers/UsuarioController.js";
import { MedicoController } from "./controllers/MedicoController.js";

const app = express();

const server = new Server(app);

const sedeController = new SedeController();
server.setController(SedeController, sedeController);

const turnoController = new TurnoController();
server.setController(TurnoController, turnoController);

const obraSocialController = new ObraSocialController();
server.setController(ObraSocialController, obraSocialController);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach(ruta => server.addRoute(ruta));
server.configurarRutas();

export default server;
