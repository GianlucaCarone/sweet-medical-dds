import { ZodError as ZodValidationError } from "zod";

export function zodErrorHandler(err, req, res, next) {
    if (err instanceof ZodValidationError) {
        const formattedErrors = err.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensaje: issue.message,
        }));
        return res.status(400).json({
            status: "fail",
            message: "Error de validación de datos",
            errors: formattedErrors,
            timestamp: new Date().toISOString()
        });
    }
    next(err);
}