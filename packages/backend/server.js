import express from "express"; // framework para crear el servidor y manejar las rutas

export class Server {
    #controllers;
    #app;
    #routes;

    constructor(app, port) {
        this.#app = app;
        this.port = port || 3000;
        this.#routes = [];
        this.#app.use(express.json());
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
        this.#routes.forEach( route => this.app.use(route(this.getController.bind(this))));

        // Middleware para manejar rutas no encontradas
        this.#app.use((req, res, _next) => {
            res.status(404).json({
                status: "fail",
                message: "La ruta solicitada no existe"
            });
        });
        
    }

    start() {
        this.#app.listen(process.env.SERVER_PORT, () => {
            console.warn(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
        });
    }
}