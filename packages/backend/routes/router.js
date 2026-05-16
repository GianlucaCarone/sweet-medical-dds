import sedeRoutes from "./sedeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import medicoRoutes from "./medicoRoutes.js";
import turnoRoutes from "./turnoRoutes.js";
import obraSocialRoutes from "./obraSocialRoutes.js";

const routes = [
  { path: "/sedes", handler: sedeRoutes },
  { path: "/health", handler: healthRoutes },
  { path: "/usuarios", handler: usuarioRoutes },
  { path: "/medicos", handler: medicoRoutes },
  { path: "/turno", handler: turnoRoutes },
  { path: "/obra-social", handler: obraSocialRoutes },
];
export default routes;
