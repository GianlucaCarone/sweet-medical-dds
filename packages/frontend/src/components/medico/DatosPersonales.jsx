import React, { useState, useEffect } from 'react';
import { User, Edit, Check } from 'lucide-react';

export default function DatosPersonales({ medico, handleGuardarDatosPersonales }) {
  const [isEditingDatos, setIsEditingDatos] = useState(false);
  const [formDatos, setFormDatos] = useState({ 
    nombre: medico.nombre || '', 
    honorario: medico.honorario || 0 
  });

  useEffect(() => {
    setFormDatos({ 
      nombre: medico.nombre || '', 
      honorario: medico.honorario || 0 
    });
  }, [medico]);

  const onGuardar = async (e) => {
    e.preventDefault();
    const success = await handleGuardarDatosPersonales(formDatos);
    if (success) {
      setIsEditingDatos(false);
    }
  };

  return (
    <form onSubmit={onGuardar} className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4">
      {/* Cabecera de la sección */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h5 className="font-weight-bold text-default m-0 d-flex align-items-center gap-2" style={{ fontSize: '13px', letterSpacing: '0.8px', color: 'var(--color-text)' }}>
          <User size={16} className="text-primary" style={{ opacity: 0.8 }} /> MIS DATOS PERSONALES
        </h5>

        {!isEditingDatos ? (
          <button
            type="button"
            onClick={() => { 
              setFormDatos({ nombre: medico.nombre, honorario: medico.honorario }); 
              setIsEditingDatos(true); 
            }}
            className="btn btn-link btn-sm text-primary font-weight-bold d-flex align-items-center gap-1 p-0 border-0"
            style={{ textDecoration: 'none', fontSize: '12px', transition: 'all 0.2s' }}
          >
            <Edit size={13} /> Editar
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success btn-xs d-flex align-items-center gap-1 px-2.5 py-1 font-weight-bold shadow-sm" style={{ fontSize: '11px', borderRadius: '6px', backgroundColor: 'var(--color-success)', border: 'none' }}>
              <Check size={12} /> Guardar
            </button>
            <button type="button" onClick={() => setIsEditingDatos(false)} className="btn btn-light btn-xs px-2.5 py-1 border text-muted" style={{ fontSize: '11px', borderRadius: '6px' }}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Cuerpo de Datos */}
      <div className="row g-3 text-default" style={{ fontSize: '13px' }}>

        {/* Fila de Nombre (Solo visible/editable si está en modo edición) */}
        {isEditingDatos && (
          <div className="col-12">
            <div className="p-2 border rounded-3" style={{ borderColor: 'var(--color-success)', backgroundColor: 'var(--color-success-light)', transition: 'all 0.2s' }}>
              <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Nombre Completo</span>
              <input
                type="text"
                className="form-control form-control-sm border-0 p-0 bg-transparent font-weight-bold text-default"
                style={{ fontSize: '13px', boxShadow: 'none', height: 'auto' }}
                value={formDatos.nombre}
                onChange={e => setFormDatos({ ...formDatos, nombre: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* Campo: Usuario */}
        <div className="col-6">
          <div className="p-2 border border-transparent rounded-3" style={{ background: isEditingDatos ? 'var(--color-bg)' : 'transparent' }}>
            <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Usuario</span>
            <span className="font-weight-bold d-block text-truncate text-muted" title={medico.usuario.nombreUsuario } style={{ fontSize: '13px' }}>{medico.usuario?.nombreUsuario || medico.usuario}</span>
          </div>
        </div>

        {/* Campo: Honorario */}
        <div className="col-6">
          {isEditingDatos ? (
            <div className="p-2 border rounded-3" style={{ borderColor: 'var(--color-success)', backgroundColor: 'var(--color-success-light)', transition: 'all 0.2s' }}>
              <span className="d-block text-success mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Honorario (ARS)</span>
              <div className="d-flex align-items-center">
                <span className="font-weight-bold text-success me-1" style={{ fontSize: '14px' }}>$</span>
                <input
                  type="number"
                  className="form-control form-control-sm border-0 p-0 bg-transparent font-weight-bold text-success"
                  style={{ fontSize: '14px', boxShadow: 'none', height: 'auto' }}
                  value={formDatos.honorario}
                  onChange={e => setFormDatos({ ...formDatos, honorario: e.target.value })}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="p-2 border border-transparent rounded-3">
              <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Honorario</span>
              <span className="font-weight-bold d-block text-success" style={{ fontSize: '14px', letterSpacing: '0.2px' }} title={medico.honorario}>
                ${Number(medico.honorario).toLocaleString('es-AR')}
              </span>
            </div>
          )}
        </div>

        {/* Campo: Documento */}
        <div className="col-6">
          <div className="p-2 border border-transparent rounded-3" style={{ background: isEditingDatos ? 'var(--color-bg)' : 'transparent' }}>
            <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Documento</span>
            <span className="font-weight-bold d-block text-muted" style={{ fontSize: '13px' }}>{medico.documento}</span>
          </div>
        </div>

        {/* Campo: Matrícula */}
        <div className="col-6">
          <div className="p-2 border border-transparent rounded-3" style={{ background: isEditingDatos ? 'var(--color-bg)' : 'transparent' }}>
            <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Matrícula</span>
            <span className="font-weight-bold d-block text-muted" style={{ fontSize: '13px' }}>{medico.matricula}</span>
          </div>
        </div>

      </div>
    </form>
  );
}
