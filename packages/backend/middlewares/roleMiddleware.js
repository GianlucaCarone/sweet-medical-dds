export const requireRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado. Token no proporcionado." });
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ message: "No tienes permiso para realizar esta acción." });
        }
        
        next();
    };
};
