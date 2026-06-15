import Chip from '@mui/material/Chip';

// Normalizamos las keys para que coincidan EXACTAMENTE con lo que manda el Backend
// Esto asegura la consistencia entre el contrato de la API y nuestra UI
const configs = {
  // --- Estados de Cobertura ---
  TOTAL: { label: '✓ Cubierto', color: 'success' },
  PARCIAL: { label: '◑ Parcial', color: 'warning' },
  NO_CUBIERTA: { label: '✗ Sin cobertura', color: 'error' },

  // --- Estados del Turno (EstadoTurnoEnum) ---
  DISPONIBLE: { label: 'Disponible', color: 'primary' },
  RESERVADO: { label: 'Reservado', color: 'warning' },
  CONFIRMADO: { label: 'Confirmado', color: 'info' }, // Agregado según lógica del backend
  FINALIZADO: { label: 'Finalizado', color: 'success' }, // Reemplaza a "realizado"
  CANCELADO: { label: 'Cancelado', color: 'error' },
  PENDIENTECAMBIO: { label: 'Pendiente', color: 'secondary' }, // Agregado para el flujo de cambio de fechas
};

export default function BadgeEstado({ status }) {
  // 1. Manejo seguro ("Fail Fast"): Si no llega status, devolvemos un fallback genérico.
  if (!status) {
    return <Chip label="Desconocido" color="default" size="small" />;
  }

  // 2. Normalizamos la cadena entrante a mayúsculas.
  // Así nos aseguramos de que coincida con nuestro diccionario (ej: si mandan "Disponible" o "DISPONIBLE" funciona igual).
  const statusNormalizado = String(status).toUpperCase();

  // 3. Buscamos en el diccionario, si no existe usamos el fallback
  const cfg = configs[statusNormalizado] ?? { label: status, color: 'default' };

  return <Chip label={cfg.label} color={cfg.color} size="small" />;
}
