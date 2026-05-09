import mongoose from "mongoose";

export class ClienteMongoDb {
    static async connect() {
        try {
            const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
            console.warn(`Se realizó la conección a mongoDB ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit();
        }
    }
}