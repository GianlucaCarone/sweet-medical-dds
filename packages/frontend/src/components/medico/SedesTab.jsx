import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { globalSedesMock } from '../../mockdata/medico';

export default function SedesTab({ sedes, onAsociar, onDesvincular }) {
  const sedesDisponibles = globalSedesMock.filter(s => !sedes.some(asig => asig._id === s._id));

  return (
    <div className="fade-in">
      <div className="border-bottom pb-3 mb-4">
        <h4 className="font-weight-bold text-default mb-1">Puestos de Trabajo</h4>
        <p className="text-muted small m-0">Administra las sedes médicas donde brindas atención.</p>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Mis Sedes */}
        <div className="col-12 col-md-6">
          <div className="bg-neutral-light p-4 rounded" style={{ border: '1px solid var(--color-divider)', minHeight: '300px' }}>
            <h5 className="font-weight-bold text-default mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
              <MapPin size={20} className="text-primary"/> Sedes Vinculadas
            </h5>
            <div className="space-y-2">
              {sedes.length === 0 ? (
                <p className="text-muted italic small text-center py-5">No hay sedes vinculadas actualmente.</p>
              ) : (
                sedes.map(sede => (
                  <div key={sede._id} className="sede-box-vinculada">
                    <div className="text-truncatepe" style={{ maxWidth: '75%' }}>
                      <p className="font-weight-bold text-default mb-1 small">{sede.nombre}</p>
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{sede.direccion}</p>
                    </div>
                    <button 
                      onClick={() => onDesvincular(sede._id)} 
                      className="btn btn-outline-danger btn-sm font-weight-bold px-2 py-1"
                      style={{ fontSize: '11px', borderRadius: '8px' }}
                    >
                      Desvincular
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Catálogo Disponible */}
        <div className="col-12 col-md-6">
          <div className="bg-surface p-4 rounded" style={{ border: '1px solid var(--color-divider)', minHeight: '300px' }}>
            <h5 className="font-weight-bold text-default mb-4" style={{ fontSize: '1.1rem' }}>Disponibles en el Sistema</h5>
            <div className="space-y-2">
              {sedesDisponibles.map(sede => (
                <div key={sede._id} className="sede-box-disponible">
                  <div className="text-truncatepe" style={{ maxWidth: '70%' }}>
                    <p className="font-weight-bold text-default mb-1 small">{sede.nombre}</p>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{sede.direccion}</p>
                  </div>
                  <button 
                    onClick={() => onAsociar(sede)} 
                    className="btn btn-outline-primary btn-sm font-weight-bold d-flex align-items-center gap-1 px-2 py-1"
                    style={{ fontSize: '11px', borderRadius: '8px' }}
                  >
                    <Plus size={11}/> Vincular Sede
                  </button>
                </div>
              ))}
              {sedesDisponibles.length === 0 && (
                <p className="text-muted italic small text-center py-5">Ya estás vinculado a todas las sedes del sistema.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
