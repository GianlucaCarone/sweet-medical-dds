import { useState, useEffect, useCallback } from 'react';
import { initialTurnosMock } from '../../../mockdata/medico';

// Helper para comparar IDs de manera robusta
const obtenerId = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'object') return obj._id || obj.id || '';
  return obj;
};

export default function useTurnos(medico, activeTab) {
  const [todosLosTurnosMock, setTodosLosTurnosMock] = useState(initialTurnosMock);
  const [turnosFiltrados, setTurnosFiltrados] = useState([]);
  const [turnosSubTab, setTurnosSubTab] = useState('RESERVADOS');
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [turnosPage, setTurnosPage] = useState(1);
  const [totalTurnosPaginas, setTotalTurnosPaginas] = useState(1);
  const [totalTurnosCount, setTotalTurnosCount] = useState(0);

  /*
  =============================================================================
  GUÍA DE INTEGRACIÓN FUTURA CON EL BACKEND (MÉDICO)
  =============================================================================
  Cuando realicemos la integración con las APIs del backend, esta sección
  reemplazará los estados simulados en memoria. Ejemplo de estructura:

  const cargarTurnosMedico = useCallback(async (estadoTab, paginaActual) => {
    setLoadingTurnos(true);
    try {
      const estadoMapeado = {
        'RESERVADOS': 'RESERVADO',
        'CONFIRMADOS': 'CONFIRMADO',
        'REALIZADOS': 'REALIZADO',
        'CANCELADOS': 'CANCELADO',
        'PROPUESTAS': 'PENDIENTECAMBIO'
      }[estadoTab];

      // Parámetros de paginación y filtros para enviar al backend
      const queryParams = {
        medicoId: medico._id,
        estado: estadoMapeado,
        pagina: paginaActual,
        limite: 4
      };

      // Llamar al endpoint del backend que implementa la consulta paginada
      const response = await getTurnosMedicoPaginado(queryParams);
      
      setTurnosFiltrados(response.turnos);
      setTotalTurnosCount(response.totalCount);
      setTotalTurnosPaginas(response.paginasTotales);
    } catch (err) {
      console.error("Error al obtener turnos del médico:", err);
    } finally {
      setLoadingTurnos(false);
    }
  }, [medico._id]);

  useEffect(() => {
    if (activeTab === 'turnos' && medico._id) {
      cargarTurnosMedico(turnosSubTab, turnosPage);
    }
  }, [activeTab, turnosSubTab, turnosPage, medico._id, cargarTurnosMedico]);
  =============================================================================
  */

  // useEffect para simular consulta paginada y on-demand (con filtros id de médico y estado) con indicador de carga
  useEffect(() => {
    if (activeTab !== 'turnos') return;
    
    setLoadingTurnos(true);
    const timer = setTimeout(() => {
      const estadoMapeado = {
        'RESERVADOS': 'RESERVADO',
        'CONFIRMADOS': 'CONFIRMADO',
        'REALIZADOS': 'REALIZADO',
        'CANCELADOS': 'CANCELADO',
        'PROPUESTAS': 'PENDIENTECAMBIO'
      }[turnosSubTab];

      // Filtro por ID de médico (robusto contra objetos e IDs puros de MongoDB)
      const todosFiltrados = todosLosTurnosMock.filter(t => 
        obtenerId(t.medico) === obtenerId(medico) && t.estado === estadoMapeado
      );

      const itemsPerPage = 4; // Páginas de 4 elementos para demostración interactiva
      const totalCount = todosFiltrados.length;
      const paginas = Math.ceil(totalCount / itemsPerPage) || 1;

      // Asegurar que la página actual no quede huérfana
      const paginaValida = Math.min(turnosPage, paginas);
      if (paginaValida !== turnosPage) {
        setTurnosPage(paginaValida);
      }

      const startIdx = (paginaValida - 1) * itemsPerPage;
      const paginados = todosFiltrados.slice(startIdx, startIdx + itemsPerPage);

      setTurnosFiltrados(paginados);
      setTotalTurnosCount(totalCount);
      setTotalTurnosPaginas(paginas);
      setLoadingTurnos(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab, turnosSubTab, todosLosTurnosMock, medico, turnosPage]);

  const handleObtenerHistorialPaciente = useCallback((id) => {
    const pacienteId = obtenerId(id);
    return todosLosTurnosMock.filter(t => 
      obtenerId(t.paciente) === pacienteId && 
      obtenerId(t.medico) === obtenerId(medico)
    );
  }, [todosLosTurnosMock, medico]);

  const handleActualizarEstadoTurno = useCallback((turnoId, nuevoEstado, motivo = '', aceptarCambio = false) => {
    setTodosLosTurnosMock(prev => prev.map(t => {
      if (t.id === turnoId) {
        let updated = { ...t };
        if (aceptarCambio) {
          if (t.fechaHoraPropuesta) {
            updated.fechaHora = t.fechaHoraPropuesta;
            updated.fechaHoraPropuesta = null;
          }
          updated.estado = 'CONFIRMADO';
          updated.historialEstado = [
            ...t.historialEstado,
            { estado: 'CONFIRMADO', usuario: 'medico', motivo: 'Cambio de fecha aceptado por el médico.' }
          ];
        } else {
          updated.estado = nuevoEstado;
          updated.historialEstado = [
            ...t.historialEstado,
            { estado: nuevoEstado, usuario: 'medico', motivo }
          ];
        }
        return updated;
      }
      return t;
    }));
  }, []);

  const handleProponerCambioTurno = useCallback((turnoId, nuevaFechaHora) => {
    setTodosLosTurnosMock(prev => prev.map(t => {
      if (t.id === turnoId) {
        return {
          ...t,
          estado: 'PENDIENTECAMBIO',
          fechaHoraPropuesta: nuevaFechaHora,
          historialEstado: [
            ...t.historialEstado,
            { estado: 'PENDIENTECAMBIO', usuario: 'medico', motivo: 'Propuesta de reprogramación enviada por el médico.' }
          ]
        };
      }
      return t;
    }));
  }, []);

  const turnosDelMedico = todosLosTurnosMock.filter(t => obtenerId(t.medico) === obtenerId(medico));
  
  const counts = {
    RESERVADOS: turnosDelMedico.filter(t => t.estado === 'RESERVADO').length,
    CONFIRMADOS: turnosDelMedico.filter(t => t.estado === 'CONFIRMADO').length,
    PROPUESTAS: turnosDelMedico.filter(t => t.estado === 'PENDIENTECAMBIO').length,
    REALIZADOS: turnosDelMedico.filter(t => t.estado === 'REALIZADO').length,
    CANCELADOS: turnosDelMedico.filter(t => t.estado === 'CANCELADO').length
  };

  return {
    turnosFiltrados,
    turnosSubTab,
    setTurnosSubTab,
    loadingTurnos,
    turnosPage,
    setTurnosPage,
    totalTurnosPaginas,
    totalTurnosCount,
    counts,
    handleObtenerHistorialPaciente,
    handleActualizarEstadoTurno,
    handleProponerCambioTurno
  };
}
