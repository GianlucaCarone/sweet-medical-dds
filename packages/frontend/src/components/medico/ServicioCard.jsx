import React from 'react';
import { Trash2 } from 'lucide-react';
import { IconButton } from '@mui/material';

export default function ServicioCard({ servicio, onEliminar }) {
  return (
    <div className="servicio-card shadow-sm h-100">
      <div>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5
            className="font-weight-bold text-default mb-0 text-truncate"
            title={servicio.nombre}
            style={{ fontSize: '1.1rem' }}
          >
            {servicio.nombre}
          </h5>
          <IconButton
            color="error"
            size="small"
            onClick={() => onEliminar(servicio.id)}
            title="Eliminar servicio"
            aria-label={`Eliminar servicio ${servicio.nombre}`}
            sx={{ p: 0.5, border: 0 }}
          >
            <Trash2 size={18} />
          </IconButton>
        </div>
        <div className="text-muted small mb-3">
          {servicio.codigo && (
            <div className="mb-1">
              <span className="font-weight-bold text-default">Código:</span> {servicio.codigo}
            </div>
          )}
          <div>
            <span className="font-weight-bold text-default">Duración:</span>{' '}
            {servicio.duracionTurnoEnMins} min
          </div>
        </div>
      </div>
      <div className="text-success font-weight-bold h5 mb-0 mt-auto border-top pt-2">
        {servicio.costo > 0 ? `$${servicio.costo?.toLocaleString('es-AR')}` : 'Gratis'}
      </div>
    </div>
  );
}
