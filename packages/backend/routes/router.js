import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import notificacionesRoutes from "./notificacionesRoutes.js"
import serviciosRoutes from "./healthRoutes.js"

const routes = [
  { path: "/sede", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  notificacionesRoutes,
  serviciosRoutes
];

export default routes;