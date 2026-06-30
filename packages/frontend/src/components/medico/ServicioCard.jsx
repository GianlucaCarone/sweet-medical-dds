import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ServicioCard({ servicio, onEliminar }) {
  return (
    <div className="servicio-card shadow-sm h-100">
      <div>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="font-weight-bold text-default mb-0 text-truncate" title={servicio.nombre} style={{ fontSize: '1.1rem' }}>
            {servicio.nombre}
          </h5>
          <button
            className="btn btn-link text-danger p-1 border-0"
            onClick={() => onEliminar(servicio._id)}
            title="Eliminar servicio"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="text-muted small mb-3">
          <div className="mb-1"><span className="font-weight-bold text-default">Código:</span> {servicio.codigo}</div>
          <div><span className="font-weight-bold text-default">Duración:</span> {servicio.duracionEstimada} min</div>
        </div>
      </div>
      <div className="text-success font-weight-bold h5 mb-0 mt-auto border-top pt-2">
        ${servicio.costoBase.toLocaleString('es-AR')}
      </div>
    </div>
  );
}
