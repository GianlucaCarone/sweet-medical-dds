import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express"
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { zodErrorHandler } from "./middlewares/zodErrorHandler.js";
import { specs } from "./config/swagger.js";

export class Server {
    #controllers;
    #app;
    #routes;

    constructor(app, port) {
        this.#app = app;
        this.port = port || 3000;
        this.#routes = [];
        this.#controllers = [];
    }

    get app() {
        return this.#app;
    }

    setController(controllerClass, controller) {
        this.#controllers[controllerClass.name] = controller;
    }

    getController(controllerClass) {
        const controller = this.#controllers[controllerClass.name];
        if (!controller) throw new Error("El controller no está definido para la ruta dada");
        return controller;
    }

    addRoute(route) {
        this.#routes.push(route);
    }

    configurarRutas() {
        const corsOptions = {
            origin: process.env.ALLOWED_ORIGINS
                ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
                : true,
            credentials: true, // necesario para que el browser envíe/reciba cookies
        };

        this.#app.options('/{*path}', cors(corsOptions));
        this.#app.use(cors(corsOptions));
        this.#app.use(cookieParser());

        this.#app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
        this.#routes.forEach(({ path, handler }) => this.app.use(path, handler(this.getController.bind(this))));

        this.#app.use(zodErrorHandler);
        this.#app.use(notFoundHandler);
        this.#app.use(errorLogger);
        this.#app.use(errorHandler);
    }

    start() {
        const port = process.env.PORT || process.env.SERVER_PORT || 3001;
        
        this.#app.listen(port, () => {
            console.warn(`Backend escuchando en puerto ${port}`);
        });
    }
}