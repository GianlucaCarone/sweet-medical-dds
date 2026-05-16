import healthRoutes from "./healthRoutes.js";
import notificacionesRoutes from "./notificacionesRoutes.js";
import serviciosRoutes from "./serviciosRoutes.js";
import seedRoute from "./seedRoute.js";
import medicoRoutes from "./medicoRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import medicoRoutes from "./medicoRoutes.js";
import turnoRoutes from "./turnoRoutes.js";
import obraSocialRoutes from "./obraSocialRoutes.js";

const routes = [
  { path: "/sedes", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/usuarios", handler: usuarioRoutes },
  { path: "/medicos", handler: medicoRoutes }
  { path: "/turno", handler: turnoRoutes },
  { path: "/obra-social", handler: obraSocialRoutes }
  { path: "/medico", handler: medicoRoutes },
  { path: "/notificaciones", handler: notificacionesRoutes },
  { path: "/seed", handler: seedRoute },
  { path: "/servicios", handler: serviciosRoutes }
];

export default routes;
