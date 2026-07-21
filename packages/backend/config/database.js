import mongoose from "mongoose";

export class ClienteMongoDb {
  static async connect() {
    try {
      const uri = `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`;

      console.log("Conectando a:", uri.replace(/\/\/.*:.*@/, "//***:***@"));

      const conn = await mongoose.connect(uri);

      console.log("DB conectada:", conn.connection.name);
      console.log("Host:", conn.connection.host);
      console.warn(
        `Se realizó la conexión a MongoDB ${conn.connection.host}`,
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}