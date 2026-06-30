import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Componente wrapper para rutas protegidas.
 *
 * Props:
 *   - children: el componente a renderizar si el acceso es válido
 *   - allowedRoles: array de roles permitidos (e.g. ["PACIENTE"] o ["MEDICO"]).
 *                   Si no se pasa, solo se requiere estar logueado.
 *   - redirectTo: ruta a la que redirigir si el acceso falla (default: "/")
 *
 * Uso:
 *   <ProtectedRoute allowedRoles={["PACIENTE"]}>
 *     <MisTurnos />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/" }) {
  const { user, loading } = useAuth();

  // Mientras se verifica la sesión (al cargar la app), no hacemos nada
  if (loading) return null;

  // Si no hay usuario logueado, redirigimos
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si hay roles definidos, verificamos que el usuario tenga el rol correcto
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
