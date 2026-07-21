import "dotenv/config"; // tiene todas las configuracione como: SERVER_PORT, ALLOWED_ORIGINS, etc. que se encuentran en el archivo .env
import dotenv from "dotenv";
import { ClienteMongoDb } from "./config/database.js";
import server from "./app.js";

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("MONGODB_DB_NAME:", process.env.MONGODB_DB_NAME);

dotenv.config();
const port = process.env.PORT || process.env.SERVER_PORT || 3001;

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