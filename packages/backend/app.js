import express from "express"; // framework para crear el servidor y manejar las rutas
import { Server } from "./server.js";
import routes from "./routes/router.js";
import { SedeController } from "./controllers/SedeController.js";

const app = express();

const server = new Server(app);

const sedeController = new SedeController();
server.setController(SedeController, sedeController);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach(ruta => server.addRoute(ruta));
server.configurarRutas();

export default server;