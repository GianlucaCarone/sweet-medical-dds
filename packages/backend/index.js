import "dotenv/config"; // tiene todas las configuracione como: SERVER_PORT, ALLOWED_ORIGINS, etc. que se encuentran en el archivo .env
import dotenv from "dotenv";
import { ClienteMongoDb } from "./config/database.js";
import server from "./app.js";

dotenv.config();
const port = process.env.SERVER_PORT;

async function start() {
  try {
    await ClienteMongoDb.connect();
    server.port = port;
    server.start();
  } catch (error) {
    console.error(error);
  }
}

start();