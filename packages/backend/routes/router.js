import healthRoutes from "./healthRoutes.js";
import medicoRoutes from "./medicoRoutes.js";
import notificacionRoutes from "./notificacionRoutes.js";
import obraSocialRoutes from "./obraSocialRoutes.js";
import sedeRoutes from "./sedeRoutes.js"
import seedRoute from "./seedRoute.js";
import servicioRoutes from "./servicioRoutes.js";
import turnoRoutes from "./turnoRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";

const routes = [
  { path: "/health", handler: healthRoutes },
  { path: "/medicos", handler: medicoRoutes },
  { path: "/notificaciones", handler: notificacionRoutes },
  { path: "/obra-social", handler: obraSocialRoutes },
  { path: "/sedes", handler: sedeRoutes },
  { path: "/seed", handler: seedRoute },
  { path: "/servicios", handler: servicioRoutes },
  { path: "/turno", handler: turnoRoutes },
  { path: "/usuarios", handler: usuarioRoutes },
  //{ path: "/usuarios/:idUsuario/notificaciones", handler: notificacionesRoutes },
];

export default routes;
