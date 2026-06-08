import React, { useState } from 'react';
import { Edit, User, KeyRound, Check } from 'lucide-react';

// Importación de componentes divididos
import ServiciosTab from './ServiciosTab';
import DisponibilidadesTab from './DisponibilidadesTab';
import SedesTab from './SedesTab';
import Modal from './Modal';

// Importación de datos mock
import { initialDoctorMock, globalSedesMock, globalServicesMock } from '../../mockdata/medico';

// Importación de estilos
import './PerfilMedico.css';

export default function PerfilMedico() {
  const [doctor, setDoctor] = useState(initialDoctorMock);
  const [activeTab, setActiveTab] = useState('servicios');
  const [modalOpen, setModalOpen] = useState(null);

  // Estado para la edición inline de datos personales
  const [isEditingDatos, setIsEditingDatos] = useState(false);
  const [formDatos, setFormDatos] = useState({ ...doctor });
  
  // Estado para el mensaje de error en disponibilidad
  const [errorDisp, setErrorDisp] = useState('');

  // Estado para el cambio de contraseña
  const [passwords, setPasswords] = useState({ anterior: '', nueva: '', confirmar: '' });
  const [error, setError] = useState('');

  // Estado para los formularios en los modals
  const [formTipoSrv, setFormTipoSrv] = useState('ESPECIALIDAD');
  const [formServicioElegido, setFormServicioElegido] = useState('');

  const [formDispDia, setFormDispDia] = useState('LUNES');
  const [formDispSede, setFormDispSede] = useState('');
  const [formDispSrv, setFormDispSrv] = useState('');
  const [formDispHoraInicio, setFormDispHoraInicio] = useState('');
  const [formDispHoraFin, setFormDispHoraFin] = useState('');

  // Estado para la confirmación de eliminación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirmAction) => {
    setConfirmModal({
      isOpen: true,
      title: title,
      message: message,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const handleCloseServicioModal = () => {
    setModalOpen(null);
    setFormServicioElegido('');
    setFormTipoSrv('ESPECIALIDAD');
  };

  const handleCloseDispModal = () => {
    setModalOpen(null);
    setErrorDisp('');
    setFormDispSrv('');
    setFormDispSede('');
    setFormDispHoraInicio('');
    setFormDispHoraFin('');
  };

  // --- MANEJADORES DE DATOS PERSONALES ---
  const handleGuardarDatosInline = (e) => {
    e.preventDefault();
    if (Number(formDatos.honorario) <= 0) {
      alert("El honorario base debe ser mayor a 0.");
      return;
    }
    setDoctor(prev => ({
      ...prev,
      nombre: formDatos.nombre,
      apellido: formDatos.apellido,
      honorario: Number(formDatos.honorario)
    }));
    setIsEditingDatos(false);
  };


  const handleCambioContrasena = (e) => {
    e.preventDefault();

    if (passwords.nueva !== passwords.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (passwords.nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwords.nueva === passwords.anterior) {
      setError('La nueva contraseña no puede ser igual a la contraseña anterior.');
      return;
    }

    setError('');
    alert('¡Contraseña actualizada con éxito!');
    setPasswords({ anterior: '', nueva: '', confirmar: '' });
  };

  // --- MANEJADORES DE SERVICIOS ---
  const opcionesServiciosDisponibles = globalServicesMock.filter(s =>
    s.tipo === formTipoSrv && !doctor.serviciosAsignados.some(ds => ds._id === s._id)
  );

  const handleAgregarServicio = (e) => {
    e.preventDefault();
    if (!formServicioElegido) return;
    const srvNuevo = globalServicesMock.find(s => s._id === formServicioElegido);

    setDoctor(prev => ({
      ...prev,
      serviciosAsignados: [...prev.serviciosAsignados, srvNuevo]
    }));
    setModalOpen(null);
    setFormServicioElegido('');
  };

  const handleEliminarServicio = (idSrv) => {
    triggerConfirm(
      "Confirmar Eliminación de Servicio",
      "¿Estás seguro de que quieres eliminar este servicio? También se eliminarán los horarios semanales de atención asociados.",
      () => {
        setDoctor(prev => ({
          ...prev,
          serviciosAsignados: prev.serviciosAsignados.filter(s => s._id !== idSrv),
          disponibilidadHoraria: prev.disponibilidadHoraria.filter(d => d.servicio._id !== idSrv)
        }));
      }
    );
  };

  // --- MANEJADORES DE DISPONIBILIDAD (HORARIOS) ---
  const handleAgregarDisponibilidad = (e) => {
    e.preventDefault();
    setErrorDisp('');
    if (!formDispSrv || !formDispSede || !formDispHoraInicio || !formDispHoraFin) {
      setErrorDisp("Por favor, completa todos los campos del formulario.");
      return;
    }

    if (formDispHoraInicio >= formDispHoraFin) {
      setErrorDisp("La hora de inicio debe ser menor a la hora de fin.");
      return;
    }

    //vemos que no se pisen horarios
    const tieneConflicto = doctor.disponibilidadHoraria.some(disp => {
    // Solo comparamos los turnos del mismo día de la semana
    if (disp.diaSemana !== formDispDia) return false;

    // Algoritmo de cruce de rangos: (InicioA < FinB) && (FinA > InicioB)
    const cruzaHorario = formDispHoraInicio < disp.horaFin && formDispHoraFin > disp.horaInicio;
    
    return cruzaHorario;
  });

  if (tieneConflicto) {
    setErrorDisp(`¡Conflicto de Horario! Ya existe un turno asignado el día ${formDispDia.toLowerCase()} que se superpone con el rango ${formDispHoraInicio} - ${formDispHoraFin}.`);
    return;
  }

    const servicioObj = doctor.serviciosAsignados.find(s => s._id === formDispSrv);
    const sedeObj = globalSedesMock.find(s => s._id === formDispSede);

    const nuevaDisp = {
      _id: `disp_${Date.now()}`,
      diaSemana: formDispDia,
      horaInicio: formDispHoraInicio,
      horaFin: formDispHoraFin,
      servicio: { _id: servicioObj._id, nombre: servicioObj.nombre },
      sede: { _id: sedeObj._id, nombre: sedeObj.nombre }
    };

    setDoctor(prev => ({
      ...prev,
      disponibilidadHoraria: [...prev.disponibilidadHoraria, nuevaDisp]
    }));

    setModalOpen(null);
    setFormDispSrv('');
    setFormDispSede('');
    setFormDispHoraInicio('');
    setFormDispHoraFin('');
  };

  const handleEliminarDisponibilidad = (idDisp) => {
    triggerConfirm(
      "Confirmar Eliminación de Horario",
      "¿Estás seguro de que quieres eliminar este horario de atención?",
      () => {
        setDoctor(prev => ({
          ...prev,
          disponibilidadHoraria: prev.disponibilidadHoraria.filter(d => d._id !== idDisp)
        }));
      }
    );
  };

  // --- MANEJADORES DE SEDES ---
  const handleAsociarSede = (sede) => {
    setDoctor(prev => ({ ...prev, sedesAsignadas: [...prev.sedesAsignadas, sede] }));
  };

  const handleDesvincularSede = (idSede) => {
    triggerConfirm(
      "Confirmar Desvinculación de Sede",
      "¿Estás seguro de que quieres desvincular esta sede? Se eliminarán los horarios asociados a ella.",
      () => {
        setDoctor(prev => ({
          ...prev,
          sedesAsignadas: prev.sedesAsignadas.filter(s => s._id !== idSede),
          disponibilidadHoraria: prev.disponibilidadHoraria.filter(d => d.sede._id !== idSede)
        }));
      }
    );
  };

  return (
    <div className="container-perfil">
      <div className="row">
        <div className="col-12">

          {/* --- SECCIÓN SUPERIOR EDITABLE (IN-LINE) --- */}
          <section className="perfil-card mb-4">
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
                      background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {doctor.nombre.charAt(0)}{doctor.apellido.charAt(0)}
                  </div>

                  {/* Textos Informativos Alabados */}
                  <div className="d-flex flex-column justify-content-center overflow-hidden">
                    <h3
                      className="text-truncate mb-1"
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1E293B',
                        letterSpacing: '-0.3px'
                      }}
                    >
                      {doctor.nombre} {doctor.apellido}
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

              {/*Datos Personales */}
              <form onSubmit={handleGuardarDatosInline} className="col-12 col-lg-4 col-border-right d-flex flex-column justify-content-center px-4">
                {/* Cabecera de la sección */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="font-weight-bold text-dark m-0 d-flex align-items-center gap-2" style={{ fontSize: '13px', letterSpacing: '0.8px', color: '#2D3748' }}>
                    <User size={16} className="text-primary" style={{ opacity: 0.8 }} /> MIS DATOS PERSONALES
                  </h5>

                  {!isEditingDatos ? (
                    <button
                      type="button"
                      onClick={() => { setFormDatos({ ...doctor }); setIsEditingDatos(true); }}
                      className="btn btn-link btn-sm text-primary font-weight-bold d-flex align-items-center gap-1 p-0 border-0"
                      style={{ textDecoration: 'none', fontSize: '12px', transition: 'all 0.2s' }}
                    >
                      <Edit size={13} /> Editar
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success btn-xs d-flex align-items-center gap-1 px-2.5 py-1 font-weight-bold shadow-sm" style={{ fontSize: '11px', borderRadius: '6px', backgroundColor: '#10B981', border: 'none' }}>
                        <Check size={12} /> Guardar
                      </button>
                      <button type="button" onClick={() => setIsEditingDatos(false)} className="btn btn-light btn-xs px-2.5 py-1 border text-muted" style={{ fontSize: '11px', borderRadius: '6px' }}>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>

                {/* Cuerpo de Datos */}
                <div className="row g-3 text-dark" style={{ fontSize: '13px' }}>

                  {/* Fila de Nombre y Apellido (Solo visible/editable si está en modo edición) */}
                  {isEditingDatos && (
                    <>
                      <div className="col-6">
                        <div className="p-2 border rounded-3" style={{ borderColor: '#10B981', backgroundColor: '#F0FDF4', transition: 'all 0.2s' }}>
                          <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Nombre</span>
                          <input
                            type="text"
                            className="form-control form-control-sm border-0 p-0 bg-transparent font-weight-bold text-dark"
                            style={{ fontSize: '13px', boxShadow: 'none', height: 'auto' }}
                            value={formDatos.nombre || ''}
                            onChange={e => setFormDatos({ ...formDatos, nombre: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 border rounded-3" style={{ borderColor: '#10B981', backgroundColor: '#F0FDF4', transition: 'all 0.2s' }}>
                          <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Apellido</span>
                          <input
                            type="text"
                            className="form-control form-control-sm border-0 p-0 bg-transparent font-weight-bold text-dark"
                            style={{ fontSize: '13px', boxShadow: 'none', height: 'auto' }}
                            value={formDatos.apellido || ''}
                            onChange={e => setFormDatos({ ...formDatos, apellido: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Campo: Usuario */}
                  <div className="col-6">
                    <div className="p-2 border border-transparent rounded-3" style={{ background: isEditingDatos ? '#F8FAFC' : 'transparent' }}>
                      <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Usuario</span>
                      <span className="font-weight-bold d-block text-truncate text-secondary" title={doctor.usuario} style={{ fontSize: '13px' }}>{doctor.usuario}</span>
                    </div>
                  </div>

                  {/* Campo: Honorario (Destacado y Premium) */}
                  <div className="col-6">
                    {isEditingDatos ? (
                      <div className="p-2 border rounded-3" style={{ borderColor: '#10B981', backgroundColor: '#F0FDF4', transition: 'all 0.2s' }}>
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
                        <span className="font-weight-bold d-block text-success" style={{ fontSize: '14px', letterSpacing: '0.2px' }} title={doctor.honorario}>
                          ${Number(doctor.honorario).toLocaleString('es-AR')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Campo: Documento */}
                  <div className="col-6">
                    <div className="p-2 border border-transparent rounded-3" style={{ background: isEditingDatos ? '#F8FAFC' : 'transparent' }}>
                      <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Documento</span>
                      <span className="font-weight-bold d-block text-secondary" style={{ fontSize: '13px' }}>{doctor.documento}</span>
                    </div>
                  </div>

                  {/* Campo: Matrícula */}
                  <div className="col-6">
                    <div className="p-2 border border-transparent rounded-3" style={{ background: isEditingDatos ? '#F8FAFC' : 'transparent' }}>
                      <span className="d-block text-muted mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Matrícula</span>
                      <span className="font-weight-bold d-block text-secondary" style={{ fontSize: '13px' }}>{doctor.matricula}</span>
                    </div>
                  </div>

                </div>
              </form>

              {/* Seguridad / Contraseña */}
              <div className="col-12 col-lg-4 d-flex flex-column justify-content-center px-4">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                  <KeyRound size={16} className="text-primary" />
                  <h5 className="font-weight-bold text-dark m-0" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>SEGURIDAD</h5>
                </div>

                <form onSubmit={handleCambioContrasena} className="d-flex flex-column gap-3">

                  {/* Contraseña Anterior */}
                  <div>
                    <input
                      type="password"
                      placeholder="Contraseña Anterior"
                      className="form-control"
                      style={{ fontSize: '13px', borderRadius: '6px' }}
                      value={passwords.anterior}
                      onChange={e => {
                        setError('');
                        setPasswords({ ...passwords, anterior: e.target.value });
                      }}
                      required={passwords.nueva.length > 0}
                    />
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <input
                      type="password"
                      placeholder="Nueva Contraseña"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      style={{ fontSize: '13px', borderRadius: '6px' }}
                      value={passwords.nueva}
                      onChange={e => {
                        setError('');
                        setPasswords({ ...passwords, nueva: e.target.value });
                      }}
                      required={passwords.anterior.length > 0}
                    />
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <input
                      type="password"
                      placeholder="Confirmar Contraseña"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      style={{ fontSize: '13px', borderRadius: '6px' }}
                      value={passwords.confirmar}
                      onChange={e => {
                        setError('');
                        setPasswords({ ...passwords, confirmar: e.target.value });
                      }}
                      required={passwords.anterior.length > 0}
                    />

                    {/* Mensaje de error visible */}
                    {error && (
                      <div className="error-message text-center w-100 d-block">
                        {error}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-outline-primary btn-sm w-100 font-weight-bold mt-2"
                    style={{ borderRadius: '8px', padding: '8px 0', fontSize: '13px' }}
                  >
                    Actualizar Contraseña
                  </button>
                </form>
              </div>

            </div>
          </section>

          {/* --- NAVEGACIÓN DE PESTAÑAS --- */}
          <section className="perfil-card p-0 overflow-hidden mb-4">
            <div className="tabs-header-container">
              {['servicios', 'disponibilidades', 'sedes', 'turnos'].map(tab => {
                const label = tab === 'servicios' ? 'Mis Servicios'
                  : tab === 'disponibilidades' ? 'Mis Horarios'
                    : tab === 'sedes' ? 'Mis Sedes'
                      : 'Mis Turnos';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="p-4">
              {activeTab === 'servicios' && (
                <ServiciosTab
                  servicios={doctor.serviciosAsignados}
                  onAdd={() => setModalOpen('servicio')}
                  onEliminar={handleEliminarServicio}
                />
              )}
              {activeTab === 'disponibilidades' && (
                <DisponibilidadesTab
                  disponibilidades={doctor.disponibilidadHoraria}
                  onAdd={() => setModalOpen('disponibilidad')}
                  onEliminar={handleEliminarDisponibilidad}
                />
              )}
              {activeTab === 'sedes' && (
                <SedesTab
                  sedesAsignadas={doctor.sedesAsignadas}
                  onAsociar={handleAsociarSede}
                  onDesvincular={handleDesvincularSede}
                />
              )}
              {activeTab === 'turnos' && (
                <p className="text-muted text-center py-5 italic small m-0">Módulo para la gestión de turnos próximamente disponible...</p>
              )}
            </div>
          </section>

        </div>
      </div>

      {/* --- MODAL PARA VINCULAR SERVICIO --- */}
      <Modal
        isOpen={modalOpen === 'servicio'}
        onClose={handleCloseServicioModal}
        title="Vincular Servicio al Perfil"
      >
        <form onSubmit={handleAgregarServicio} className="d-flex flex-column gap-3">
          <div className="alert alert-info py-2 px-3 m-0" style={{ fontSize: '12px', borderRadius: '8px' }}>
            Selecciona un servicio disponible en el sistema.
          </div>
          <div>
            <label className="form-label font-weight-bold text-dark small mb-1">1. Tipo de Servicio</label>
            <select
              className="form-select form-select-sm"
              value={formTipoSrv}
              onChange={(e) => { setFormTipoSrv(e.target.value); setFormServicioElegido(''); }}
            >
              <option value="ESPECIALIDAD">Especialidad</option>
              <option value="PRACTICA">Práctica Médica</option>
            </select>
          </div>
          <div>
            <label className="form-label font-weight-bold text-dark small mb-1">2. Selecciona el Servicio</label>
            <select
              required
              className="form-select form-select-sm"
              value={formServicioElegido}
              onChange={(e) => setFormServicioElegido(e.target.value)}
            >
              <option value="" disabled>-- Seleccionar servicio --</option>
              {opcionesServiciosDisponibles.map(srv => (
                <option key={srv._id} value={srv._id}>{srv.nombre} ({srv.duracionEstimada} min)</option>
              ))}
            </select>
          </div>
          <div className="pt-3 d-flex justify-content-end gap-2 border-top">
            <button
              type="button"
              onClick={handleCloseServicioModal}
              className="btn btn-light btn-sm font-weight-bold text-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formServicioElegido}
              className="btn btn-primary btn-sm font-weight-bold"
            >
              Vincular
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL PARA REGISTRAR HORARIO DE ATENCIÓN --- */}
      <Modal
        isOpen={modalOpen === 'disponibilidad'}
        onClose={handleCloseDispModal}
        title="Registrar Horario de Atención"
      >
        <form onSubmit={handleAgregarDisponibilidad} className="d-flex flex-column gap-3">

          <div className="row g-2">
            <div className="col-6">
              <label className="form-label font-weight-bold text-dark small mb-1">Día</label>
              <select
                className="form-select form-select-sm"
                value={formDispDia}
                onChange={e => {
                  setErrorDisp('');
                  setFormDispDia(e.target.value)}}
              >
                <option value="LUNES">Lunes</option>
                <option value="MARTES">Martes</option>
                <option value="MIERCOLES">Miércoles</option>
                <option value="JUEVES">Jueves</option>
                <option value="VIERNES">Viernes</option>
                <option value="SABADO">Sábado</option>
                <option value="DOMINGO">Domingo</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label font-weight-bold text-dark small mb-1">Sede</label>
              <select
                required
                className="form-select form-select-sm"
                value={formDispSede}
                onChange={e => {
                  setErrorDisp('');
                  setFormDispSede(e.target.value)}}
              >
                <option value="" disabled>-- Seleccionar Sede --</option>
                {doctor.sedesAsignadas.map(s => <option key={s._id} value={s._id}>{s.nombre}</option>)}
              </select>
              {doctor.sedesAsignadas.length === 0 && (
                <div className="text-danger mt-1 font-weight-bold" style={{ fontSize: '10px' }}>
                  Vincula una sede primero desde la pestaña de Sedes.
                </div>
              )}
            </div>
          </div>

          {errorDisp && (
            <div className="error-message text-center w-100 d-block">
              {errorDisp}
            </div>
          )}

          <div>
            <label className="form-label font-weight-bold text-dark small mb-1">Especialidad / Práctica</label>
            <select
              required
              className="form-select form-select-sm"
              value={formDispSrv}
              onChange={e => {
                setErrorDisp('');
                setFormDispSrv(e.target.value)}}
            >
              <option value="" disabled>-- Seleccionar un servicio de tu perfil --</option>
              {doctor.serviciosAsignados.map(srv => (
                <option key={srv._id} value={srv._id}>[{srv.tipo}] {srv.nombre} ({srv.duracionEstimada} min)</option>
              ))}
            </select>
          </div>

          <div className="bg-light p-3 rounded" style={{ border: '1px solid #e2e8f0' }}>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label font-weight-bold text-dark small mb-1">Hora de Inicio</label>
                <input
                  type="time"
                  required
                  className="form-control form-control-sm"
                  value={formDispHoraInicio}
                  onChange={e => {
                    setErrorDisp('');
                    setFormDispHoraInicio(e.target.value)}} 
                />
              </div>
              <div className="col-6">
                <label className="form-label font-weight-bold text-dark small mb-1">Hora de Fin</label>
                <input
                  type="time"
                  required
                  className="form-control form-control-sm"
                  value={formDispHoraFin}
                  onChange={e => {
                    setErrorDisp('');
                    setFormDispHoraFin(e.target.value)}}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 d-flex justify-content-end gap-2 border-top">
            <button
              type="button"
              onClick={handleCloseDispModal}
              className="btn btn-light btn-sm font-weight-bold text-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-success btn-sm font-weight-bold"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación para eliminaciones */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
      >
        <div className="p-3">
          <p className="mb-4 text-secondary">{confirmModal.message}</p>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-light btn-sm font-weight-bold text-secondary"
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </button>
            <button
              className="btn btn-danger btn-sm font-weight-bold"
              onClick={confirmModal.onConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
