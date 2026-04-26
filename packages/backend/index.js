import "dotenv/config"; // tiene todas las configuracione como: SERVER_PORT, ALLOWED_ORIGINS, etc. que se encuentran en el archivo .env
import express from "express"; // framework para crear el servidor y manejar las rutas
import cors from "cors"; // middleware para permitir solicitudes desde diferentes orígenes (CORS)
import router from "./routes/router.js"
import dotenv from "dotenv"

import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config()
const app = express();

app.use(express.json());
app.use(cors())
app.use(router)

app.use(notFoundHandler)
app.use(errorLogger)
app.use(errorHandler)


app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);


app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});
