import { useState } from 'react';
import { initialDoctorMock, globalSedesMock, globalServicesMock } from '../../../mockdata/medico';

export default function useDoctorProfile(triggerConfirm, setAlertConfig) {
  const [doctor, setDoctor] = useState(initialDoctorMock);

  // --- MANEJADORES DE SERVICIOS ---
  const handleAgregarServicio = (idServicioElegido) => {
    if (!idServicioElegido) return;
    const srvNuevo = globalServicesMock.find(s => s._id === idServicioElegido);
    setDoctor(prev => ({
      ...prev,
      serviciosAsignados: [...prev.serviciosAsignados, srvNuevo]
    }));
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
  const handleAgregarDisponibilidad = (dispData, editingDispId) => {
    const { formDispDia, formDispSede, formDispSrv, formDispHoraInicio, formDispHoraFin } = dispData;

    //vemos que no se pisen horarios
    const tieneConflicto = doctor.disponibilidadHoraria.some(disp => {
      // Si estamos editando y es el mismo slot, lo ignoramos para no colisionar consigo mismo
      if (editingDispId && disp._id === editingDispId) return false;

      // Solo comparamos los turnos del mismo día de la semana
      if (disp.diaSemana !== formDispDia) return false;

      // Algoritmo de cruce de rangos: (InicioA < FinB) && (FinA > InicioB)
      const cruzaHorario = formDispHoraInicio < disp.horaFin && formDispHoraFin > disp.horaInicio;
      
      return cruzaHorario;
    });

    if (tieneConflicto) {
      return { success: false, error: `¡Conflicto de Horario! Ya existe un turno asignado el día ${formDispDia.toLowerCase()} que se superpone con el rango ${formDispHoraInicio} - ${formDispHoraFin}.` };
    }

    const servicioObj = doctor.serviciosAsignados.find(s => s._id === formDispSrv);
    const sedeObj = globalSedesMock.find(s => s._id === formDispSede);

    if (editingDispId) {
      setDoctor(prev => ({
        ...prev,
        disponibilidadHoraria: prev.disponibilidadHoraria.map(disp => {
          if (disp._id === editingDispId) {
            return {
              ...disp,
              diaSemana: formDispDia,
              horaInicio: formDispHoraInicio,
              horaFin: formDispHoraFin,
              servicio: { _id: servicioObj._id, nombre: servicioObj.nombre },
              sede: { _id: sedeObj._id, text: sedeObj.nombre, nombre: sedeObj.nombre }
            };
          }
          return disp;
        })
      }));
    } else {
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
    }
    return { success: true };
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

  const handleGuardarDatosPersonales = (nuevosDatos) => {
    if (Number(nuevosDatos.honorario) <= 0) {
      setAlertConfig({
        isOpen: true,
        title: 'Honorario Inválido',
        message: 'El honorario base debe ser mayor a 0.',
        type: 'error'
      });
      return false;
    }
    setDoctor(prev => ({
      ...prev,
      nombre: nuevosDatos.nombre,
      apellido: nuevosDatos.apellido,
      honorario: Number(nuevosDatos.honorario)
    }));
    return true;
  };

  return {
    doctor,
    setDoctor,
    handleAgregarServicio,
    handleEliminarServicio,
    handleAgregarDisponibilidad,
    handleEliminarDisponibilidad,
    handleAsociarSede,
    handleDesvincularSede,
    handleGuardarDatosPersonales
  };
}
