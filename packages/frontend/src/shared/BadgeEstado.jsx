import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

const configs = {
  TOTAL: { label: '✓ Cubierto', statusKey: 'TOTAL' },
  PARCIAL: { label: '◑ Parcial', statusKey: 'PARCIAL' },
  NO_CUBIERTA: { label: '✗ Sin cobertura', statusKey: 'NO_CUBIERTA' },
  DISPONIBLE: { label: 'Disponible', statusKey: 'DISPONIBLE' },
  RESERVADO: { label: 'Reservado', statusKey: 'RESERVADO' },
  CONFIRMADO: { label: 'Confirmado', statusKey: 'CONFIRMADO' },
  FINALIZADO: { label: 'Finalizado', statusKey: 'FINALIZADO' },
  CANCELADO: { label: 'Cancelado', statusKey: 'CANCELADO' },
  PENDIENTECAMBIO: { label: 'Pendiente', statusKey: 'PENDIENTECAMBIO' },
};

export default function BadgeEstado({ status }) {
  const theme = useTheme();

  if (!status) {
    return;
  }

  const statusNormalizado = String(status).toUpperCase();
  const cfg = configs[statusNormalizado];

  if (!cfg) {
    return <Chip label={status} color="default" size="small" />;
  }

  const badgeColor = theme.customPalette.badge[cfg.statusKey] || {};

  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        backgroundColor: badgeColor.light,
        color: badgeColor.main,
        fontWeight: 600,
      }}
    />
  );
}
