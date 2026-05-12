import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";

const routes = [
  { path: "/sedes", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/usuarios", handler: usuarioRoutes }
];
export default routes;