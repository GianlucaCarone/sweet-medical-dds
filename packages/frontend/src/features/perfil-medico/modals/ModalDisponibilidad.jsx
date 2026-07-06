import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function ModalDisponibilidad({ isOpen, onClose, medico, handleAgregarDisponibilidad, initialData, editingDispId }) {
  const [formDispDia, setFormDispDia] = useState('LUNES');
  const [formDispSede, setFormDispSede] = useState('');
  const [formDispSrv, setFormDispSrv] = useState('');
  const [formDispHoraInicio, setFormDispHoraInicio] = useState('');
  const [formDispHoraFin, setFormDispHoraFin] = useState('');
  const [errorDisp, setErrorDisp] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormDispDia(initialData.diaSemana || 'LUNES');
        setFormDispSede(initialData.sede?.id || '');
        setFormDispSrv(initialData.servicio?.id || '');
        setFormDispHoraInicio(initialData.horaDesde || '');
        setFormDispHoraFin(initialData.horaHasta || '');
      } else {
        setFormDispDia('LUNES');
        setFormDispSede('');
        setFormDispSrv('');
        setFormDispHoraInicio('');
        setFormDispHoraFin('');
      }
      setErrorDisp('');
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    setErrorDisp('');
    onClose();
  };

  const onSubmit = async (e) => {
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

    const dispData = {
      formDispDia,
      formDispSede,
      formDispSrv,
      formDispHoraInicio,
      formDispHoraFin
    };

    const result = await handleAgregarDisponibilidad(dispData, editingDispId);
    if (!result.success) {
      setErrorDisp(result.error);
    } else {
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingDispId ? "Editar Horario de Atención" : "Registrar Horario de Atención"}
    >
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">

        <div className="row g-2">
          <div className="col-6">
            <label className="form-label font-weight-bold text-default small mb-1">Día</label>
            <select
              className="form-select form-select-sm"
              value={formDispDia}
              onChange={e => {
                setErrorDisp('');
                setFormDispDia(e.target.value);
              }}
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
            <label className="form-label font-weight-bold text-default small mb-1">Sede</label>
            <select
              required
              className="form-select form-select-sm"
              value={formDispSede}
              onChange={e => {
                setErrorDisp('');
                setFormDispSede(e.target.value);
              }}
            >
              <option value="" disabled>-- Seleccionar Sede --</option>
              {medico.sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            {medico.sedes.length === 0 && (
              <div className="text-danger mt-1 font-weight-bold" style={{ fontSize: '10px' }}>
                Vincula una sede primero desde la pestaña de Sedes.
              </div>
            )}
          </div>
        </div>


        <div>
          <label className="form-label font-weight-bold text-default small mb-1">Especialidad / Práctica</label>
          <select
            required
            className="form-select form-select-sm"
            value={formDispSrv}
            onChange={e => {
              setErrorDisp('');
              setFormDispSrv(e.target.value);
            }}
          >
            <option value="" disabled>-- Seleccionar un servicio de tu perfil --</option>
            {[...(medico.especialidades || []), ...(medico.practicas || [])].map(srv => (
              <option key={srv.id} value={srv.id}>[{srv.tipo}] {srv.nombre} ({srv.duracionTurnoEnMins} min)</option>
            ))}
          </select>
        </div>

        <div className="bg-surface p-3 rounded" style={{ border: '1px solid var(--color-divider)' }}>
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label font-weight-bold text-default small mb-1">Hora de Inicio</label>
              <input
                type="time"
                required
                className="form-control form-control-sm"
                value={formDispHoraInicio}
                onChange={e => {
                  setErrorDisp('');
                  setFormDispHoraInicio(e.target.value);
                }} 
              />
            </div>
            <div className="col-6">
              <label className="form-label font-weight-bold text-default small mb-1">Hora de Fin</label>
              <input
                type="time"
                required
                className="form-control form-control-sm"
                value={formDispHoraFin}
                onChange={e => {
                  setErrorDisp('');
                  setFormDispHoraFin(e.target.value);
                }} 
              />
            </div>
          </div>
        </div>


        {errorDisp && (
          <div className="alert alert-danger p-2 small mb-0 mt-2">
            {errorDisp}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-light btn-sm font-weight-bold text-muted"
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
  );
}
