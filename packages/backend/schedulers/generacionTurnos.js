import cron from "node-cron";

export function iniciarGeneracionTurnosBatch(turnoService) {
    cron.schedule("* * * * *", async () => {
        try {
            console.log("Ejecutando batch de generación de turnos");
            await turnoService.generarTurnosDisponibles();
        } catch (error) {
            console.error("Error en batch de generación de turnos", error);
        }
    });
}