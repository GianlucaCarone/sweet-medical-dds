import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getAllServicios } from '../../../api/servicio';
import {useAlert} from '../../../context/AlertContext.jsx';

export default function ModalAgregarServicio({ isOpen, onClose, medico, handleAgregarServicio }) {
  const [formTipoSrv, setFormTipoSrv] = useState('Especialidad');
  const [formServicioElegido, setFormServicioElegido] = useState('');
  const [todosLosServicios, setTodosLosServicios] = useState([]);
  const {showAlert} = useAlert();

  useEffect(() => {
    if (isOpen) {
      getAllServicios()
        .then(data => setTodosLosServicios(data?.data || data || []))
        .catch(() => setTodosLosServicios([]));
    }
  }, [isOpen]);

  const serviciosYaAsignados = [...(medico.especialidades || []), ...(medico.practicas || [])];
  const opcionesServiciosDisponibles = todosLosServicios.filter(s => {
    if (s.tipo !== formTipoSrv) return false;

    const yaAsignado = serviciosYaAsignados.some(ds => ds.id === s.id);
    if (yaAsignado) return false;

    // REGLA DE NEGOCIO: Si es una práctica, el médico debe tener asignada la especialidad padre correspondiente
    if (s.tipo === 'Practica') {
      const padreId = s.especialidadPadreId?._id 
        ? s.especialidadPadreId._id.toString() 
        : s.especialidadPadreId?.toString();

      const tienePadre = (medico.especialidades || []).some(
        esp => (esp.id || esp._id).toString() === padreId
      );
      return tienePadre;
    }

    return true;
  });

  const totalNoAsignadosDeTipo = todosLosServicios.filter(s =>
    s.tipo === formTipoSrv && !serviciosYaAsignados.some(ds => ds.id === s.id)
  ).length;

  const faltanEspecialidadesPadre = formTipoSrv === 'Practica' && totalNoAsignadosDeTipo > 0 && opcionesServiciosDisponibles.length === 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleAgregarServicio(formServicioElegido);
    if (success) {
      setFormServicioElegido('');
      setFormTipoSrv('Especialidad');
      showAlert('Servicio vinculado correctamente.', 'success');
      onClose();
    }
  };

  const handleClose = () => {
    setFormServicioElegido('');
    setFormTipoSrv('Especialidad');
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
            <option value="Especialidad">Especialidad</option>
            <option value="Practica">Práctica Médica</option>
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
              <option key={srv.id} value={srv.id}>{srv.nombre}</option>
            ))}
          </select>
          {opcionesServiciosDisponibles.length === 0 && (
            <div className="mt-1" style={{ fontSize: '11px', color: faltanEspecialidadesPadre ? '#d97706' : '#6b7280' }}>
              {faltanEspecialidadesPadre 
                ? "Para vincular prácticas médicas, primero debes tener asignada la especialidad correspondiente."
                : "Ya tienes vinculados todos los servicios disponibles de este tipo."}
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
            className="btn btn-success btn-sm font-weight-bold"
          >
            Vincular
          </button>
        </div>
      </form>
    </Modal>
  );
}
