import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

/**
 * Rutas de autenticación:
 *   POST /auth/login    → inicia sesión, setea cookie HttpOnly
 *   POST /auth/logout   → cierra sesión, borra la cookie
 *   GET  /auth/me       → devuelve el usuario autenticado (requiere cookie válida)
 *   POST /auth/registro → registra un nuevo paciente y lo loguea automáticamente
 */
export default function authRoutes() {
    const router = express.Router();
    const authController = new AuthController();

    router.post("/login", (req, res, next) => authController.login(req, res, next));
    router.post("/logout", (req, res, next) => authController.logout(req, res, next));
    router.get("/me", authMiddleware, (req, res, next) => authController.me(req, res, next));
    router.post("/registro", (req, res, next) => authController.registro(req, res, next));

    return router;
}
