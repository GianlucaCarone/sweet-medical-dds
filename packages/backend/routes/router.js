import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import notificacionesRoutes from "./notificacionesRoutes.js";
import serviciosRoutes from "./serviciosRoutes.js";
import seedRoute from "./seedRoute.js";
import medicoRoutes from "./medicoRoutes.js";

const routes = [

  { path: "/health", handler: healthRoutes },
  { path: "/medico", handler: medicoRoutes },
  { path: "/notificaciones", handler: notificacionesRoutes },
  { path: "/sede", handler: sedeRoutes },
  { path: "/seed", handler: seedRoute },
  { path: "/servicios", handler: serviciosRoutes }
];

export default routes;