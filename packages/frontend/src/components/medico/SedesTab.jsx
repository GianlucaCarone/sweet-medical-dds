import React, { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { getAllSedes } from '../../api/sede';
import { Button } from '@mui/material';

export default function SedesTab({ sedesAsignadas = [], onAsociar, onDesvincular }) {
  const sedes = sedesAsignadas;
  const [todasLasSedes, setTodasLasSedes] = useState([]);

  useEffect(() => {
    getAllSedes()
      .then(data => setTodasLasSedes(data?.data || data || []))
      .catch(() => setTodasLasSedes([]));
  }, []);

  const sedesDisponibles = todasLasSedes.filter(
    s => !sedes.some(asig => asig.id === s.id)
  );

  return (
    <div className="fade-in">
      <div className="border-bottom pb-3 mb-4">
        <h4 className="font-weight-bold text-default mb-1">Puestos de Trabajo</h4>
        <p className="text-muted small m-0">Administra las sedes médicas donde brindas atención.</p>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Mis Sedes */}
        <div className="col-12 col-md-6">
          <div className="bg-surface p-4 rounded" style={{ border: '1px solid var(--color-divider)', minHeight: '300px' }}>
            <h5 className="font-weight-bold text-default mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
              <MapPin size={20} className="text-primary"/> Sedes Vinculadas
            </h5>
            <div className="space-y-2">
              {sedes.length === 0 ? (
                <p className="text-muted italic small text-center py-5">No hay sedes vinculadas actualmente.</p>
              ) : (
                sedes.map(sede => (
                  <div key={sede.id} className="sede-box-vinculada">
                    <div className="text-truncatepe" style={{ maxWidth: '75%' }}>
                      <p className="font-weight-bold text-default mb-1 small">{sede.nombre}</p>
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{sede.direccion}</p>
                    </div>
                    <Button 
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDesvincular(sede.id)} 
                      sx={{ fontSize: '11px', borderRadius: '8px', fontWeight: 'bold', px: 2, py: 0.5 }}
                      aria-label={`Desvincular sede ${sede.nombre}`}
                    >
                      Desvincular
                    </Button>
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
                <div key={sede.id} className="sede-box-disponible">
                  <div className="text-truncatepe" style={{ maxWidth: '70%' }}>
                    <p className="font-weight-bold text-default mb-1 small">{sede.nombre}</p>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{sede.direccion}</p>
                  </div>
                  <Button 
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => onAsociar(sede)} 
                    startIcon={<Plus size={11}/>}
                    sx={{ fontSize: '11px', borderRadius: '8px', fontWeight: 'bold', px: 2, py: 0.5 }}
                    aria-label={`Vincular sede ${sede.nombre}`}
                  >
                    Vincular Sede
                  </Button>
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
