import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import turnoRoutes from "./turnoRoutes.js";

const routes = [
  { path: "/sede", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/turno", handler: turnoRoutes }
];
export default routes;
