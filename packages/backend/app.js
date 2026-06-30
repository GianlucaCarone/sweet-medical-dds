import express from "express"; // framework para crear el servidor y manejar las rutas
import { Server } from "./server.js";
import { MedicoController } from "./controllers/MedicoController.js";
import { NotificacionController } from "./controllers/NotificacionController.js";
import { ObraSocialController } from "./controllers/ObraSocialController.js";
import { PacienteController } from "./controllers/PacienteController.js";
import { SedeController } from "./controllers/SedeController.js";
import { ServicioController } from "./controllers/ServicioController.js";
import { TurnoController } from "./controllers/TurnoController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";
import { TurnoService } from "./services/TurnoService.js";
import { iniciarGeneracionTurnosBatch } from "./schedulers/generacionTurnos.js";
import routes from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = new Server(app);

server.setController(
    MedicoController,
    new MedicoController()
);

server.setController(
    NotificacionController,
    new NotificacionController()
);

server.setController(
    ObraSocialController, 
    new ObraSocialController()
);

server.setController(
    PacienteController,
    new PacienteController()
);

server.setController(
    SedeController,
    new SedeController()
);

server.setController(
    ServicioController,
    new ServicioController()
);

server.setController(
    TurnoController, 
    new TurnoController()
);

server.setController(
    UsuarioController,
    new UsuarioController()
);

iniciarGeneracionTurnosBatch(new TurnoService());

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach((ruta) => server.addRoute(ruta));
server.configurarRutas();

export default server;