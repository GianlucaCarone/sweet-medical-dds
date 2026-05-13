import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import medicoRoutes from "./medicoRoutes.js";

const routes = [
  { path: "/sedes", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/usuarios", handler: usuarioRoutes },
  { path: "/medicos", handler: medicoRoutes }
];
export default routes;