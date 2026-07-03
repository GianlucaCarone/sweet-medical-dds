import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Check, AlertTriangle, FileText, DollarSign, History } from 'lucide-react';
import Modal from '../../features/perfil-medico/modals/Modal';

export default function TurnosTab({
  turnos,
  subTab,
  setSubTab,
  loading,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  counts,
  onActualizarEstado,
  onProponerCambio,
  onObtenerHistorialPaciente
}) {
  const [cancelingId, setCancelingId] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [reprogrammingId, setReprogrammingId] = useState(null);
  const [nuevaFechaHoraPropuesta, setNuevaFechaHoraPropuesta] = useState('');
  
  // Historial del paciente
  const [pacienteHistorial, setPacienteHistorial] = useState(null); // objeto paciente

  // Historial de cambios de estado del turno
  const [turnoHistorial, setTurnoHistorial] = useState(null); // objeto turno

  // Alerta personalizada estética
  const [customAlert, setCustomAlert] = useState({ isOpen: false, title: '', message: '' });

  // Helper para resolver IDs robustamente
  const obtenerId = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'object') return obj._id || obj.id || '';
    return obj;
  };

  // Obtener texto seguro de obra social
  const obtenerObraSocialText = (paciente) => {
    if (!paciente) return 'No especificado';
    if (typeof paciente.obraSocial === 'object' && paciente.obraSocial !== null) {
      return paciente.obraSocial.nombre || paciente.obraSocial.denominacion || 'Obra Social';
    }
    return paciente.obraSocial || 'Particular';
  };

  // Obtener texto seguro de plan
  const obtenerPlanText = (paciente) => {
    if (!paciente) return '';
    if (typeof paciente.plan === 'object' && paciente.plan !== null) {
      return paciente.plan.nombre || paciente.plan.codigo || '';
    }
    return paciente.plan || '';
  };

  // Resolver nombre de actor de cambios de estado
  const obtenerNombreActor = (usuarioId, turno) => {
    if (!usuarioId) return 'Sistema';
    const cleanUser = obtenerId(usuarioId);
    
    const uId = typeof usuarioId === 'object' ? (usuarioId).toString() : String(usuarioId);
    const medicoId = turno.medico ? String(turno.medico._id) : null;
    const pacienteId = turno.paciente ? String(turno.paciente._id) : null;

    if(uId === medicoId) {
      return 'Médico';
    }
    if(uId === pacienteId) {
      return 'Paciente';
    }
    return 'Sistema';
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' hs';
  };

  // Validar si un turno es cancelable (más de 1 hora de anticipación)
  const puedesCancelar = (fechaHoraStr) => {
    const ahora = new Date();
    const fechaTurno = new Date(fechaHoraStr);
    const diffMs = fechaTurno - ahora;
    const diffHoras = diffMs / (1000 * 60 * 60);
    return diffHoras >= 1;
  };

  // Validar cancelación
  const handleCancelarClick = (turno) => {
    setMotivoCancelacion('');
    setReprogrammingId(null);
    
    if (!puedesCancelar(turno.fechaHora)) {
      setCustomAlert({
        isOpen: true,
        title: 'Acción No Permitida',
        message: 'No se puede cancelar el turno con menos de 1 hora de anticipación.'
      });
      return;
    }

    setCancelingId(turno.id);
  };

  const handleConfirmarCancelacion = (turnoId) => {
    if (!motivoCancelacion.trim()) {
      setCustomAlert({
        isOpen: true,
        title: 'Motivo Obligatorio',
        message: 'Por favor, indica un motivo para cancelar el turno.'
      });
      return;
    }
    onActualizarEstado(turnoId, 'CANCELADO', motivoCancelacion);
    setCancelingId(null);
    setMotivoCancelacion('');
  };

  const handleReprogramarClick = (turno) => {
    setCancelingId(null);
    setNuevaFechaHoraPropuesta('');
    setReprogrammingId(turno.id);
  };

  const handleConfirmarReprogramacion = (turnoId) => {
    if (!nuevaFechaHoraPropuesta) {
      setCustomAlert({
        isOpen: true,
        title: 'Fecha Requerida',
        message: 'Por favor, selecciona una nueva fecha y hora para proponer la reprogramación.'
      });
      return;
    }
    onProponerCambio(turnoId, nuevaFechaHoraPropuesta);
    setReprogrammingId(null);
    setNuevaFechaHoraPropuesta('');
  };

  // Obtener historial completo de un paciente
  const verHistorialPaciente = (paciente) => {
    const historial = onObtenerHistorialPaciente(paciente.id);
    setPacienteHistorial({
      paciente,
      historial: [...historial].sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
    });
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="font-weight-bold text-default m-0">Gestión de Turnos</h4>
      </div>

      {/* Sub-navegación de estados */}
      <div className="d-flex gap-2 mb-4 flex-wrap border-bottom pb-3">
        {[
          { key: 'RESERVADOS', label: 'Reservados', count: counts.RESERVADOS || 0 },
          { key: 'CONFIRMADOS', label: 'Confirmados', count: counts.CONFIRMADOS || 0 },
          { key: 'PROPUESTAS', label: 'Propuestas de Cambio', count: counts.PROPUESTAS || 0 },
          { key: 'REALIZADOS', label: 'Realizados', count: counts.REALIZADOS || 0 },
          { key: 'CANCELADOS', label: 'Cancelados', count: counts.CANCELADOS || 0 }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setSubTab(tab.key);
              setCancelingId(null);
              setReprogrammingId(null);
            }}
            className={`btn btn-sm font-weight-bold px-3 py-2 position-relative d-flex align-items-center gap-2`}
            style={{
              borderRadius: '8px',
              backgroundColor: subTab === tab.key ? 'var(--color-info-light)' : 'var(--color-neutral-light)',
              color: subTab === tab.key ? 'var(--color-info-dark)' : 'var(--color-text-muted)',
              border: 'none',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
            <span className="badge bg-neutral text-white" style={{ fontSize: '10px' }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Spinner de Carga On-Demand */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
            <span className="visually-hidden">Cargando turnos...</span>
          </div>
          <p className="text-muted mt-2 small">Cargando listado de turnos...</p>
        </div>
      ) : (
        <>
          {/* Listado de turnos */}
          <div className="row g-3">
          {turnos.length > 0 ? (
            turnos.map(turno => (
              <div key={turno.id} className="col-12 col-md-6">
                <div className="servicio-card h-100 d-flex flex-column justify-content-between p-3" style={{ border: '1px solid var(--color-divider)', borderRadius: '12px', backgroundColor: 'var(--color-surface)' }}>
                  <div>
                    {/* Cabecera del Turno */}
                    <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
                      <div>
                        <span className="font-weight-bold text-default d-block" style={{ fontSize: '15px' }}>
                          {turno.paciente.nombre}
                        </span>
                        <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                          DNI: {turno.paciente.dni} | Obra Social: {obtenerObraSocialText(turno.paciente)} {obtenerPlanText(turno.paciente) ? `| Plan: ${obtenerPlanText(turno.paciente)}` : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => verHistorialPaciente(turno.paciente)}
                        className="btn btn-link btn-xs p-0 text-primary font-weight-bold d-flex align-items-center gap-1 border-0"
                        style={{ textDecoration: 'none', fontSize: '11px' }}
                      >
                        <FileText size={12} /> Historial
                      </button>
                    </div>
                    
                    {/* Detalles de la cita */}
                    <div className="d-flex flex-column gap-2 text-default mb-3" style={{ fontSize: '13px' }}>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                      <span className="text-capitalize">{formatearFecha(turno.fechaHora)}</span>
                  </div>
                      <div className="d-flex align-items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span>{formatearHora(turno.fechaHora)}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        <span>{turno.sede.nombre || turno.sede}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <DollarSign size={14} className="text-primary" />
                        <span>Costo: ${turno.costo || 'No especificado'}</span>
                      </div>
                      <div className="mt-1 d-flex flex-column gap-1">
                        <span className="badge bg-neutral-light text-default border px-2 py-1 font-weight-bold me-auto" style={{ fontSize: '11px' }}>
                        {turno.servicio.nombre}
                      </span>

                    {['RESERVADO', 'CONFIRMADO', 'PENDIENTECAMBIO'].includes(turno.estado) && (
                          <div className={`d-flex align-items-center gap-1 mt-2 p-2 rounded-3 ${puedesCancelar(turno.fechaHora) ? 'text-muted' : 'text-danger font-weight-bold'}`} style={{ fontSize: '11px', backgroundColor: puedesCancelar(turno.fechaHora) ? 'var(--color-bg)' : 'var(--color-error-light)', border: puedesCancelar(turno.fechaHora) ? '1px dashed var(--color-divider)' : '1px solid var(--color-error-light)' }}>
                        <AlertTriangle size={12} className={puedesCancelar(turno.fechaHora) ? 'text-warning' : 'text-danger'} />
                        <span>
                          {puedesCancelar(turno.fechaHora) 
                            ? 'Los turnos solo se pueden cancelar con más de 1 hora de anticipación.' 
                            : 'Tiempo límite de cancelación superado (menos de 1 hora restante).'}
                        </span>
                      </div>
                    )}
                  </div>
                  </div>

                    {/* Estado PENDIENTECAMBIO Detalles */}
                    {turno.estado === 'PENDIENTECAMBIO' && turno.fechaHoraPropuesta && (
                      <div className="alert alert-warning p-2.5 rounded-3 mb-3 d-flex flex-column gap-1" style={{ fontSize: '12px' }}>
                        <span className="font-weight-bold text-default d-flex align-items-center gap-1">
                          <AlertTriangle size={13} className="text-warning" /> Propuesta de Cambio
                        </span>
                        <span>Fecha Propuesta: <strong>{formatearFecha(turno.fechaHoraPropuesta)} - {formatearHora(turno.fechaHoraPropuesta)}</strong></span>
                        <span className="text-muted small">
                          Cambio solicitado por {turno.historialEstado?.slice().reverse().find(h => h.estado === 'PENDIENTECAMBIO')?.usuario === 'medico' ? 'ti (Médico)' : 'el paciente'}.
                        </span>
                      </div>
                    )}

                    {/* Estado CANCELADO Detalles */}
                    {turno.estado === 'CANCELADO' && (
                      <div className="alert alert-danger p-2.5 rounded-3 mb-3" style={{ fontSize: '12px', backgroundColor: 'var(--color-error-light)', border: '1px solid var(--color-error-light)', color: 'var(--color-error-dark)' }}>
                        <strong>Motivo de Cancelación:</strong> {turno.historialEstado?.find(h => h.estado === 'CANCELADO')?.motivo || 'No indicado.'}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="border-top pt-3 mt-auto">
                    {cancelingId === turno.id ? (
                      <div className="p-2 bg-neutral-light rounded-3 border">
                        <label className="form-label small font-weight-bold text-default mb-1">Indica el Motivo de Cancelación</label>
                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows="2"
                          value={motivoCancelacion}
                          onChange={e => setMotivoCancelacion(e.target.value)}
                          placeholder="Ej: Ausencia justificada del profesional..."
                          style={{ fontSize: '12px' }}
                        />
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-xs btn-light px-2 py-1 border" style={{ fontSize: '11px' }} onClick={() => setCancelingId(null)}>Volver</button>
                          <button className="btn btn-xs btn-danger px-2 py-1 font-weight-bold" style={{ fontSize: '11px' }} onClick={() => handleConfirmarCancelacion(turno.id)}>Confirmar</button>
                        </div>
                      </div>
                    ) : reprogrammingId === turno.id ? (
                      <div className="p-2 bg-neutral-light rounded-3 border">
                        <label className="form-label small font-weight-bold text-default mb-1">Selecciona Fecha y Hora Propuesta</label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-sm mb-2"
                          value={nuevaFechaHoraPropuesta}
                          onChange={e => setNuevaFechaHoraPropuesta(e.target.value)}
                          style={{ fontSize: '12px' }}
                        />
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-xs btn-light px-2 py-1 border" style={{ fontSize: '11px' }} onClick={() => setReprogrammingId(null)}>Cancelar</button>
                          <button className="btn btn-xs btn-primary px-2 py-1 font-weight-bold" style={{ fontSize: '11px' }} onClick={() => handleConfirmarReprogramacion(turno.id)}>Enviar Propuesta</button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2 align-items-center w-100">
                        {turno.estado === 'RESERVADO' && (
                          <>
                            <button
                              onClick={() => onActualizarEstado(turno.id, 'CONFIRMADO')}
                              className="btn btn-success btn-sm font-weight-bold d-flex align-items-center gap-1"
                              style={{ fontSize: '11px', borderRadius: '6px' }}
                            >
                              <Check size={12} /> Confirmar
                            </button>
                            <button
                              onClick={() => handleReprogramarClick(turno)}
                              className="btn btn-outline-primary btn-sm font-weight-bold"
                              style={{ fontSize: '11px', borderRadius: '6px' }}
                            >
                              Proponer Cambio
                            </button>
                            {puedesCancelar(turno.fechaHora) && (
                              <button
                                onClick={() => handleCancelarClick(turno)}
                                className="btn btn-outline-danger btn-sm font-weight-bold"
                                style={{ fontSize: '11px', borderRadius: '6px' }}
                              >
                                Cancelar
                              </button>
                            )}
                          </>
                        )}

                        {turno.estado === 'CONFIRMADO' && (
                          <>
                            <button
                              onClick={() => onActualizarEstado(turno.id, 'REALIZADO')}
                              className="btn btn-primary btn-sm font-weight-bold d-flex align-items-center gap-1"
                              style={{ fontSize: '11px', borderRadius: '6px' }}
                            >
                              <Check size={12} /> Marcar Realizado
                            </button>
                            <button
                              onClick={() => handleReprogramarClick(turno)}
                              className="btn btn-outline-primary btn-sm font-weight-bold"
                              style={{ fontSize: '11px', borderRadius: '6px' }}
                            >
                              Proponer Cambio
                            </button>
                            {puedesCancelar(turno.fechaHora) && (
                              <button
                                onClick={() => handleCancelarClick(turno)}
                                className="btn btn-outline-danger btn-sm font-weight-bold"
                                style={{ fontSize: '11px', borderRadius: '6px' }}
                              >
                                Cancelar
                              </button>
                            )}
                          </>
                        )}

                        {turno.estado === 'PENDIENTECAMBIO' && (
                          <>
                            {turno.historialEstado?.slice().reverse().find(h => h.estado === 'PENDIENTECAMBIO')?.usuario !== 'medico' ? (
                              <button
                                onClick={() => onActualizarEstado(turno.id, 'CONFIRMADO', '', true)}
                                className="btn btn-success btn-sm font-weight-bold"
                                style={{ fontSize: '11px', borderRadius: '6px' }}
                              >
                                Aceptar Cambio
                              </button>
                            ) : (
                              <span className="text-muted small italic me-auto">Esperando confirmación del paciente...</span>
                            )}
                            {puedesCancelar(turno.fechaHora) && (
                              <button
                                onClick={() => handleCancelarClick(turno)}
                                className="btn btn-outline-danger btn-sm font-weight-bold ms-auto"
                                style={{ fontSize: '11px', borderRadius: '6px' }}
                              >
                                Cancelar Turno
                              </button>
                            )}
                          </>
                        )}

                        {(turno.estado === 'REALIZADO' || turno.estado === 'CANCELADO') && (
                          <span className="text-muted small italic me-auto">Finalizado</span>
                        )}

                        <button
                          onClick={() => setTurnoHistorial(turno)}
                          className="btn btn-outline-secondary btn-sm font-weight-bold d-flex align-items-center gap-1 ms-auto"
                          style={{ fontSize: '11px', borderRadius: '6px' }}
                          title="Historial de Estados del Turno"
                        >
                          <History size={12} /> Historial
                        </button>
                      </div>
                    )}
                  </div>
              </div>
              </div>

            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 border rounded-3 bg-neutral-light">
                <p className="text-muted italic m-0">No se encontraron turnos en este estado.</p>
              </div>
            </div>
          )}
        </div>

        {/* paginacion */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <span className="text-muted" style={{ fontSize: '12.5px' }}>
              Mostrando página <strong>{page}</strong> de <strong>{totalPages}</strong> ({totalItems} turnos en total)
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm font-weight-bold px-3 py-1.5"
                style={{ borderRadius: '8px', fontSize: '12px', transition: 'all 0.2s' }}
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                Anterior
              </button>
              <button
                className="btn btn-outline-secondary btn-sm font-weight-bold px-3 py-1.5"
                style={{ borderRadius: '8px', fontSize: '12px', transition: 'all 0.2s' }}
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
        </>
    )}

      {/* Modal de Historial del Paciente */}
      <Modal
        isOpen={!!pacienteHistorial}
        onClose={() => setPacienteHistorial(null)}
        title={pacienteHistorial ? `Historial Clínico de Turnos: ${pacienteHistorial.paciente.nombre}` : ''}
      >
        {pacienteHistorial && (
          <div className="p-3" style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <div className="mb-3 p-2 bg-neutral-light rounded" style={{ fontSize: '12px' }}>
              <span className="d-block text-default"><strong>Paciente:</strong> {pacienteHistorial.paciente.nombre}</span>
              <span className="d-block text-default"><strong>DNI:</strong> {pacienteHistorial.paciente.dni}</span>
              <span className="d-block text-default"><strong>Obra Social / Plan:</strong> {obtenerObraSocialText(pacienteHistorial.paciente)} {obtenerPlanText(pacienteHistorial.paciente) ? `/ ${obtenerPlanText(pacienteHistorial.paciente)}` : ''}</span>
              <span className="d-block text-default"><strong>Usuario:</strong> {pacienteHistorial.paciente.usuario}</span>
            </div>
            
            <h6 className="font-weight-bold mb-2 text-primary" style={{ fontSize: '13px' }}>Turnos del Paciente</h6>
            <div className="d-flex flex-column gap-2">
              {pacienteHistorial.historial.map((histTurno, idx) => {
                const badgeColor = histTurno.estado === 'REALIZADO' ? 'bg-success'
                                 : histTurno.estado === 'CANCELADO' ? 'bg-danger'
                                 : histTurno.estado === 'CONFIRMADO' ? 'bg-primary'
                                 : histTurno.estado === 'PENDIENTECAMBIO' ? 'bg-warning text-default'
                                 : 'bg-neutral';
                return (
                  <div key={idx} className="p-2 border rounded d-flex justify-content-between align-items-center" style={{ fontSize: '12px' }}>
                    <div>
                      <span className="d-block text-default font-weight-bold">{formatearFecha(histTurno.fechaHora)} - {formatearHora(histTurno.fechaHora)}</span>
                      <span className="text-muted text-xs">{histTurno.servicio.nombre} ({histTurno.sede.nombre || histTurno.sede})</span>
                    </div>
                    <span className={`badge ${badgeColor} text-white px-2 py-1`}>{histTurno.estado}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

       {/* Modal de Historial de Estados del Turno */}
      <Modal
        isOpen={!!turnoHistorial}
        onClose={() => setTurnoHistorial(null)}
        title={turnoHistorial ? `Historial de Estados - Turno #${turnoHistorial.id.replace('turno_', '')}` : ''}
      >
        {turnoHistorial && (
          <div className="p-3">
            <div className="mb-3 p-2.5 bg-neutral-light rounded-3" style={{ fontSize: '12px' }}>
              <span className="d-block text-default"><strong>Paciente:</strong> {turnoHistorial.paciente.nombre}</span>
              <span className="d-block text-default"><strong>Servicio:</strong> {turnoHistorial.servicio.nombre}</span>
              <span className="d-block text-default"><strong>Fecha/Hora original:</strong> {formatearFecha(turnoHistorial.fechaHora)} - {formatearHora(turnoHistorial.fechaHora)}</span>
            </div>

            <h6 className="font-weight-bold mb-3 text-primary" style={{ fontSize: '13px' }}>Estados del turno</h6>
            <div className="position-relative ps-4 border-start py-1" style={{ borderColor: 'var(--color-divider)' }}>
              {turnoHistorial.historialEstado && turnoHistorial.historialEstado.length > 0 ? (
                turnoHistorial.historialEstado.map((hist, idx) => {
                  const badgeColor = hist.estado === 'REALIZADO' ? 'bg-success'
                                   : hist.estado === 'CANCELADO' ? 'bg-danger'
                                   : hist.estado === 'CONFIRMADO' ? 'bg-primary'
                                   : hist.estado === 'PENDIENTECAMBIO' ? 'bg-warning text-default'
                                   : 'bg-neutral';
                  return (
                    <div key={idx} className="mb-4 position-relative">
                      {/* Indicador del punto en la línea de tiempo */}
                      <div 
                        className="position-absolute" 
                        style={{ 
                          left: '-31px', 
                          top: '2px', 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: hist.estado === 'CANCELADO' ? 'var(--color-error)' : hist.estado === 'REALIZADO' ? 'var(--color-success)' : 'var(--color-info)',
                          border: '2px solid var(--color-surface)',
                          boxShadow: '0 0 0 2px var(--color-divider)'
                        }}
                      />
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className={`badge ${badgeColor} px-2 py-0.5`} style={{ fontSize: '10px' }}>{hist.estado}</span>
                        <span className="text-muted small" style={{ fontSize: '11px' }}>
                          por <strong>{obtenerNombreActor(hist.usuario, turnoHistorial)}</strong>
                        </span>
                      </div>
                      {hist.motivo && (
                        <p className="text-muted m-0 border-start ps-2 py-0.5 italic" style={{ fontSize: '12px', borderLeftColor: 'var(--color-divider)' }}>
                          "{hist.motivo}"
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted small italic">Sin historial registrado.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Alerta Estético Personalizado */}
      <Modal
        isOpen={customAlert.isOpen}
        onClose={() => setCustomAlert({ ...customAlert, isOpen: false })}
        title={customAlert.title}
      >
        <div className="p-4 text-center">
          <div className="d-inline-flex p-3 bg-neutral-light rounded-circle mb-3 text-warning">
            <AlertTriangle size={32} />
          </div>
          <h5 className="font-weight-bold text-default mb-2">{customAlert.title}</h5>
          <p className="text-muted mb-4" style={{ fontSize: '13.5px' }}>{customAlert.message}</p>
          <button
            className="btn btn-primary px-4 py-2 font-weight-bold"
            style={{ borderRadius: '8px', fontSize: '13px' }}
            onClick={() => setCustomAlert({ ...customAlert, isOpen: false })}
          >
            Entendido
          </button>
        </div>
      </Modal>

    </div>
  );
}
