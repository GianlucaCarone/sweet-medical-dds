import React from 'react';
import DatosPersonales from './DatosPersonales';
import SeguridadCard from './SeguridadCard';

export default function CabeceraPerfil({
  doctor,
  handleGuardarDatosPersonales,
  setAlertConfig
}) {
  return (
    <header className="perfil-card mb-4">
      <div className="row g-4">

        {/* Columna 1: Perfil e Iniciales Rediseñado */}
        <div className="col-12 col-lg-4 col-border-right d-flex align-items-center px-4 py-3">
          <div className="d-flex align-items-center gap-3 w-100">

            {/* Avatar Circular Premium */}
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold shadow-sm"
              style={{
                width: '64px',
                height: '64px',
                fontSize: '22px',
                flexShrink: 0,
                background: 'linear-gradient(135deg, var(--color-info) 0%, var(--color-info-dark) 100%)',
                letterSpacing: '0.5px'
              }}
            >
              {doctor.nombre?.charAt(0)}{doctor.apellido ? doctor.apellido.charAt(0) : ''}
            </div>

            {/* Textos Informativos Alabados */}
            <div className="d-flex flex-column justify-content-center overflow-hidden">
              <h3
                className="text-truncate mb-1"
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--color-text)',
                  letterSpacing: '-0.3px'
                }}
              >
                {doctor.nombre} {doctor.apellido || ''}
              </h3>

              <span
                className="text-primary font-weight-bold"
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  opacity: 0.9
                }}
              >
                Médico Especialista
              </span>
            </div>

          </div>
        </div>

        {/* Columna 2: Datos Personales */}
        <DatosPersonales 
          doctor={doctor} 
          handleGuardarDatosPersonales={handleGuardarDatosPersonales} 
        />

        {/* Columna 3: Seguridad / Contraseña */}
        <SeguridadCard setAlertConfig={setAlertConfig} />

      </div>
    </header>
  );
}
