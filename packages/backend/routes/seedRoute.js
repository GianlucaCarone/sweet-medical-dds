import express from "express";
import { UsuarioController } from "../controllers/usuariosController.js";
import { MedicoController } from "../controllers/MedicoController.js";
import { ServiciosController } from "../controllers/serviciosController.js";
import { NotificacionesController } from "../controllers/notificacionesController.js";
import { logger } from '../config/logger.js';

export default function seedRoute(getController) {
    const router = express.Router();

    const usuariosController = getController(UsuarioController);
    const medicosController = getController(MedicoController);
    const serviciosController = getController(ServiciosController);
    const notificacionesController = getController(NotificacionesController);

    router.get("/", async (req, res, next) => {
        try {
            const usuarios = await usuariosController.seed();
            const medicos = await medicosController.seed(usuarios);
            const notificaciones = await notificacionesController.seed(usuarios);
            const servicios = await serviciosController.seed();

            res.json({
                mensaje: "Seed ejecutado correctamente",
                resultados: {
                    usuarios,
                    medicos,
                    notificaciones,
                    servicios
                }
            });
        } catch (error) {
            next(error);
        }
    });
    return router;
}