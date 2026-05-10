import express from "express"; // framework para crear el servidor y manejar las rutas
import cors from "cors"; // middleware para permitir solicitudes desde diferentes orígenes (CORS)
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { Server } from "./server.js";
import routes from "./routes/router.js";
import { SedeRepository } from "./repositories/SedeRepository.js";
import { SedeService } from "./services/SedeService.js";
import { SedeController } from "./controllers/SedeController.js";

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


app.listen(process.env.SERVER_PORT, () => {
  console.warn(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});

const server = new Server(app);

/* -------------------------------------------------------------------------- */
/*                                    Sede                                    */
/* -------------------------------------------------------------------------- */

const sedeRepository = new SedeRepository();
const sedeService = new SedeService(sedeRepository);
const sedeController = new SedeController(sedeService);

server.setController(SedeController, sedeController);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach(ruta => server.addRoute(ruta));
server.configurarRutas();

export default server;