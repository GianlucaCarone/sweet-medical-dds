import express from "express"; // framework para crear el servidor y manejar las rutas
import cors from "cors"; // middleware para permitir solicitudes desde diferentes orígenes (CORS)
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { zodErrorHandler } from "./middlewares/zodErrorHandler.js";
import { Server } from "./server.js";
import routes from "./routes/router.js";

import { ServicioController } from "./controllers/ServicioController.js";
import { NotificacionController } from "./controllers/NotificacionController.js";
import { TurnoController } from "./controllers/TurnoController.js";
import { ObraSocialController } from "./controllers/ObraSocialController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";
import { MedicoController } from "./controllers/MedicoController.js";
import { SedeController } from "./controllers/SedeController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = new Server(app);

server.setController(
    ServicioController,
    new ServicioController()
);

server.setController(
    NotificacionController,
    new NotificacionController()
);

server.setController(
    UsuarioController,
    new UsuarioController()
);

server.setController(
    MedicoController,
    new MedicoController()
);

server.setController(
    SedeController,
    new SedeController()
)

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
