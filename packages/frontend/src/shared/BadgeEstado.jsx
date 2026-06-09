import Chip from '@mui/material/Chip'
const configs = {
  total: { label: '✓ Cubierto', color: 'success' },
  parcial: { label: '◑ Parcial', color: 'warning' },
  no_cubierta: { label: '✗ Sin cobertura', color: 'error' },
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
