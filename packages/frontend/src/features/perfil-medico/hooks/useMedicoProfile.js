import { useState, useEffect } from 'react';
import { 
  getMedicoByIdUsuario,
  agregarServicio,
  eliminarServicio,
  agregarDisponibilidad,
  modificarDisponibilidad,
  eliminarDisponibilidad,
  agregarSede,
  eliminarSede
} from '../../../api/medico';

export const useGetMedicoByIdUsuario = (idUsuario) => {
  const [medico, setMedico] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMedico = async () => {
      setCargando(true);
      const datos = await getMedicoByIdUsuario(idUsuario);
      // getMedicoByIdUsuario devuelve data directamente o envuelto en { data: ... }
      setMedico(datos.data || datos);
      setCargando(false);
    }
    if (idUsuario) {
      cargarMedico();
    }
  }, [idUsuario]);

  return { medico, cargando };
} 

export default function useMedicoProfile(medicoInicial, triggerConfirm, setAlertConfig) {
  const [medico, setMedico] = useState(medicoInicial);

  const actualizarEstado = (response) => {
    // Dependiendo de si la API devuelve el objeto envuelto en { status, data }
    const nuevoMedico = response.data || response;
    setMedico(nuevoMedico);
  };

  const handleError = (e, mensajeDefault) => {
    setAlertConfig({
      isOpen: true,
      title: 'Error',
      message: e.response?.data?.message || mensajeDefault,
      type: 'error'
    });
  };

  // --- MANEJADORES DE SERVICIOS ---
  const handleAgregarServicio = async (idServicioElegido) => {
    if (!idServicioElegido) return;
    try {
      const resp = await agregarServicio(medico.id, idServicioElegido);
      actualizarEstado(resp);
    } catch (e) {
      handleError(e, "No se pudo agregar el servicio.");
    }
  };

  const handleEliminarServicio = (idSrv) => {
    triggerConfirm(
      "Confirmar Eliminación de Servicio",
      "¿Estás seguro de que quieres eliminar este servicio? También se eliminarán los horarios semanales de atención asociados.",
      async () => {
        try {
          const resp = await eliminarServicio(medico.id, idSrv);
          actualizarEstado(resp);
        } catch (e) {
          handleError(e, "No se pudo eliminar el servicio.");
        }
      }
    );
  };

  // --- MANEJADORES DE DISPONIBILIDAD (HORARIOS) ---
  const handleAgregarDisponibilidad = async (dispData, editingDispId) => {
    const { formDispDia, formDispSede, formDispSrv, formDispHoraInicio, formDispHoraFin } = dispData;

    const payload = {
      diaSemana: formDispDia,
      horaDesde: formDispHoraInicio,
      horaHasta: formDispHoraFin,
      sedeId: formDispSede,
      servicioId: formDispSrv
    };

    try {
      if (editingDispId) {
        // En el backend la ruta PUT /disponibilidades actualiza por diaSemana
        const resp = await modificarDisponibilidad(medico.id, payload);
        actualizarEstado(resp);
      } else {
        const resp = await agregarDisponibilidad(medico.id, payload);
        actualizarEstado(resp);
      }
      return { success: true };
    } catch (e) {
      const errorMessage = e.response?.data?.message || "No se pudo guardar la disponibilidad.";
      return { success: false, error: errorMessage };
    }
  };

  const handleEliminarDisponibilidad = (idDisp, diaSemana) => {
    // Nota: El backend elimina por diaSemana. Necesitamos asegurarnos de pasar diaSemana.
    triggerConfirm(
      "Confirmar Eliminación de Horario",
      "¿Estás seguro de que quieres eliminar este horario de atención?",
      async () => {
        try {
          // Buscamos la disponibilidad si diaSemana no fue provisto
          let dia = diaSemana;
          if (!dia) {
             const dispObj = medico.disponibilidades.find(d => (d.id || d._id) === idDisp);
             if (dispObj) dia = dispObj.diaSemana;
          }
          if (dia) {
            const resp = await eliminarDisponibilidad(medico.id, dia);
            actualizarEstado(resp);
          }
        } catch (e) {
          handleError(e, "No se pudo eliminar el horario.");
        }
      }
    );
  };

  // --- MANEJADORES DE SEDES ---
  const handleAsociarSede = async (sede) => {
    try {
      const resp = await agregarSede(medico.id, sede.id || sede._id);
      actualizarEstado(resp);
    } catch (e) {
      handleError(e, "No se pudo asociar la sede.");
    }
  };

  const handleDesvincularSede = (idSede) => {
    triggerConfirm(
      "Confirmar Desvinculación de Sede",
      "¿Estás seguro de que quieres desvincular esta sede? Se eliminarán los horarios asociados a ella.",
      async () => {
        try {
          const resp = await eliminarSede(medico.id, idSede);
          actualizarEstado(resp);
        } catch (e) {
          handleError(e, "No se pudo desvincular la sede.");
        }
      }
    );
  };

  const handleGuardarDatosPersonales = (nuevosDatos) => {
    // TODO: Falta endpoint de PUT /medicos/:id en la API para actualizar datos
    if (Number(nuevosDatos.honorario) <= 0) {
      setAlertConfig({
        isOpen: true,
        title: 'Honorario Inválido',
        message: 'El honorario base debe ser mayor a 0.',
        type: 'error'
      });
      return false;
    }
    setMedico(prev => ({
      ...prev,
      nombre: nuevosDatos.nombre,
      apellido: nuevosDatos.apellido,
      honorario: Number(nuevosDatos.honorario)
    }));
    return true;
  };

  return {
    medico,
    setMedico,
    handleAgregarServicio,
    handleEliminarServicio,
    handleAgregarDisponibilidad,
    handleEliminarDisponibilidad,
    handleAsociarSede,
    handleDesvincularSede,
    handleGuardarDatosPersonales
  };
}
