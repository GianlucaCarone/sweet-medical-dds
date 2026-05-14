import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";

const routes = [
  { path: "/sede", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/turno", handler: healthRoutes }
];
export default routes;
