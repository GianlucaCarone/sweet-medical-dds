import Chip from '@mui/material/Chip'
const configs = {
  TOTAL: { label: '✓ Cubierto', color: 'success' },
  PARCIAL: { label: '◑ Parcial', color: 'warning' },
  NO_CUBIERTA: { label: '✗ Sin cobertura', color: 'error' },
  disponible: { label: 'Disponible', color: 'primary' },
  reservado: { label: 'Reservado', color: 'warning' },
  realizado: { label: 'Realizado', color: 'success' },
  cancelado: { label: 'Cancelado', color: 'error' }
}
export default function BadgeEstado ({ status }) {
  console.log(status);
  
  const cfg = configs[status] ?? { label: status, color: 'default' }
  return <Chip label={cfg.label} color={cfg.color} size='small' />
}
