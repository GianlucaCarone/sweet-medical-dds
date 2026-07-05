import React from 'react';
import { User } from 'lucide-react';

export default function DatosPersonales({ medico }) {
  return (
    <div className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4">
      {/* Cabecera de la sección */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h5 className="font-weight-bold text-default m-0 d-flex align-items-center gap-2" style={{ fontSize: '13px', letterSpacing: '0.8px', color: 'var(--color-text)' }}>
          <User size={16} className="text-primary" style={{ opacity: 0.8 }} /> MIS DATOS PERSONALES
        </h5>
      </div>

      {/* Cuerpo de Datos */}
      <div className="row g-3 text-default" style={{ fontSize: '13px' }}>

        {/* Campo: Usuario */}
        <div className="col-6">
          <div className="p-2 border border-transparent rounded-3">
            <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Usuario</span>
            <span className="font-weight-bold d-block text-truncate text-muted" title={medico.usuario?.nombreUsuario || medico.usuario || ""} style={{ fontSize: '13px' }}>{medico.usuario?.nombreUsuario || medico.usuario}</span>
          </div>
        </div>

        {/* Campo: Honorario */}
        <div className="col-6">
            <div className="p-2 border border-transparent rounded-3">
              <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Honorario</span>
              <span className="font-weight-bold d-block text-truncate text-muted" style={{ fontSize: '14px', letterSpacing: '0.2px' }} title={medico.honorario}>
                ${Number(medico.honorario).toLocaleString('es-AR')}
              </span>
            </div>
        </div>

        {/* Campo: Matrícula */}
        <div className="col-6">
          <div className="p-2 border border-transparent rounded-3">
            <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Matrícula</span>
            <span className="font-weight-bold d-block text-muted" style={{ fontSize: '13px' }}>{medico.matricula}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
