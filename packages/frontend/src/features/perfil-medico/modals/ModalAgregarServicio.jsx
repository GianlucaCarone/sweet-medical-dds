import React, { useState } from 'react';
import Modal from './Modal';
import { globalServicesMock } from '../../../mockdata/medico';
import {useAlert} from '../../../context/AlertContext.jsx';

export default function ModalAgregarServicio({ isOpen, onClose, doctor, handleAgregarServicio }) {
  const [formTipoSrv, setFormTipoSrv] = useState('ESPECIALIDAD');
  const [formServicioElegido, setFormServicioElegido] = useState('');
  const {showAlert} = useAlert();

  const opcionesServiciosDisponibles = globalServicesMock.filter(s =>
    s.tipo === formTipoSrv && !doctor.serviciosAsignados.some(ds => ds._id === s._id)
  );

  const onSubmit = (e) => {
    e.preventDefault();
    handleAgregarServicio(formServicioElegido);
    setFormServicioElegido('');
    setFormTipoSrv('ESPECIALIDAD');
    showAlert('Servicio vinculado correctamente.', 'success');
    onClose();
  };

  const handleClose = () => {
    setFormServicioElegido('');
    setFormTipoSrv('ESPECIALIDAD');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Vincular Nuevo Servicio"
    >
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label font-weight-bold text-default small mb-1">Tipo de Servicio</label>
          <select
            className="form-select form-select-sm"
            value={formTipoSrv}
            onChange={e => {
              setFormTipoSrv(e.target.value);
              setFormServicioElegido('');
            }}
          >
            <option value="ESPECIALIDAD">Especialidad</option>
            <option value="PRACTICA">Práctica Médica</option>
          </select>
        </div>

        <div>
          <label className="form-label font-weight-bold text-default small mb-1">Servicio a Vincular</label>
          <select
            className="form-select form-select-sm"
            value={formServicioElegido}
            onChange={e => setFormServicioElegido(e.target.value)}
            required
          >
            <option value="" disabled>-- Seleccione --</option>
            {opcionesServiciosDisponibles.map(srv => (
              <option key={srv._id} value={srv._id}>{srv.nombre}</option>
            ))}
          </select>
          {opcionesServiciosDisponibles.length === 0 && (
            <div className="text-muted mt-1" style={{ fontSize: '11px' }}>
              Ya tienes vinculados todos los servicios disponibles de este tipo.
            </div>
          )}
        </div>

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
            disabled={!formServicioElegido}
            className="btn btn-primary btn-sm font-weight-bold"
          >
            Vincular
          </button>
        </div>
      </form>
    </Modal>
  );
}
