import cron from "node-cron";

export function iniciarGeneracionTurnosBatch(turnoService) {
    cron.schedule("5 * * * *", async () => { // Esto se ejecutará cada hora en el minuto 5 (ej: 12:05, 13:05, etc.)
        try {
            console.log("Ejecutando batch de generación de turnos");
            await turnoService.generarTurnosDisponibles();
        } catch (error) {
            console.error("Error en batch de generación de turnos", error);
        }
    });
}