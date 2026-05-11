import mongoose from "mongoose";

export class ClienteMongoDb {
    static async connect() {
        try {
            const conexionDb = process.env.MONGODB_URI;
            const conn = await mongoose.connect(`${conexionDb}`);
            console.warn(`Se realizo la conexion a mongoDB ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit();
        }
    }
}