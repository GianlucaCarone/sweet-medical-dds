import express from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { MedicoController } from "../controllers/MedicoController.js";
import { ServicioController } from "../controllers/ServicioController.js";
import { NotificacionController } from "../controllers/NotificacionController.js";

export default function seedRoute(getController) {
    const router = express.Router();

    const usuarioController = getController(UsuarioController);
    const medicoController = getController(MedicoController);
    const servicioController = getController(ServicioController);
    const notificacionController = getController(NotificacionController);

    router.get("/", async (req, res, next) => {
        try {
            const usuarios = await usuarioController.seed();
            const medicos = await medicoController.seed(usuarios);
            const notificaciones = await notificacionController.seed(usuarios);
            const servicios = await servicioController.seed();

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