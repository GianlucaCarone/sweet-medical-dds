import express from "express"; // framework para crear el servidor y manejar las rutas
import { Server } from "./server.js";
import routes from "./routes/router.js";
import { SedeController } from "./controllers/SedeController.js";

import { ServiciosController } from "./controllers/serviciosController.js";
import { NotificacionesController } from "./controllers/notificacionesController.js";
import { UsuarioController } from "./controllers/usuariosController.js";
import { MedicoController } from "./controllers/MedicoController.js";

const app = express();

const server = new Server(app);

const sedeController = new SedeController();
server.setController(SedeController, sedeController);

server.setController(
    ServiciosController,
    new ServiciosController()
);

server.setController(
    NotificacionesController,
    new NotificacionesController()
);

server.setController(
    UsuarioController,
    new UsuarioController()
);

server.setController(
    MedicoController,
    new MedicoController()
);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach(ruta => server.addRoute(ruta));
server.configurarRutas();



export default server;