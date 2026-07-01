import jwt from "jsonwebtoken";

/**
 * Middleware que verifica el JWT almacenado en la cookie HttpOnly.
 * Si el token es válido, agrega `req.user` con los datos del usuario.
 * Si no, responde con 401.s
 */
export function authMiddleware(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "No autenticado. Se requiere inicio de sesión." });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, nombreUsuario, rol, medicoId, pacienteId, iat, exp }
        next();
    } catch (error) {
        // Token expirado o inválido
        res.clearCookie("token");
        return res.status(401).json({ message: "Sesión expirada. Por favor iniciá sesión nuevamente." });
    }
}
