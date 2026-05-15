import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import turnoRoutes from "./turnoRoutes.js";
import obraSocialRoutes from "./obraSocialRoutes.js";

const routes = [
  { path: "/sede", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/turno", handler: turnoRoutes },
  { path: "/obra-social", handler: obraSocialRoutes }
];
export default routes;
