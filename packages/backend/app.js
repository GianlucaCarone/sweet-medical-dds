import express from "express"; // framework para crear el servidor y manejar las rutas
import { Server } from "./server.js";
import routes from "./routes/router.js";
import { SedeController } from "./controllers/SedeController.js";
import { TurnoController } from "./controllers/TurnoController.js";
import { ObraSocialController } from "./controllers/ObraSocialController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";
import { MedicoController } from "./controllers/MedicoController.js";
import { TurnoService } from "./services/TurnoService.js";
import { iniciarGeneracionTurnosBatch } from "./batch/generacionTurnos.js";

const app = express();

const server = new Server(app);

const sedeController = new SedeController();
server.setController(SedeController, sedeController);

const turnoController = new TurnoController();
server.setController(TurnoController, turnoController);

const obraSocialController = new ObraSocialController();
server.setController(ObraSocialController, obraSocialController);

const usuarioController = new UsuarioController();
server.setController(UsuarioController, usuarioController);

const medicoController = new MedicoController();
server.setController(MedicoController, medicoController);

const turnoService = new TurnoService();

iniciarGeneracionTurnosBatch(turnoService);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach((ruta) => server.addRoute(ruta));
server.configurarRutas();

export default server;
