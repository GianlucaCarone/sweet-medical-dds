import express from "express";
import { UsuarioController } from "../controllers/usuariosController.js";
import { MedicoController } from "../controllers/MedicoController.js";
import { ServiciosController } from "../controllers/serviciosController.js";
import { NotificacionesController } from "../controllers/notificacionesController.js";

const router = express.Router();
const usuariosController = new UsuarioController();
const medicosController = new MedicoController();
const serviciosController = new ServiciosController();
const notificacionesController = new NotificacionesController();

router.get("/seed", async (req, res, next) => {
    try {
        const usuarios  = await usuariosController.seed(); // 1ro, otros dependen de esto
        const medicos   = await medicosController.seed(usuarios); // 2do, recibe lo anterior
        const notificaciones = await notificacionesController.seed(usuarios); // 3ro, lo mismo
        const servicios = await serviciosController.seed(); // 4to

        res.json({
            mensaje: "Seed ejecutado correctamente",
            resultados: { usuarios, medicos, notificaciones, servicios }
        });
    } catch (error) {
        next(error);
    }
});

export default router;