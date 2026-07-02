import { useState, useEffect, useCallback } from 'react';
import { 
  getMisTurnos, 
  cambiarEstadoTurno, 
  solicitarCambioFecha,
  getContadoresTurnos
} from '../../../api/turno';

export default function useTurnos(medico, activeTab) {
  const [turnosFiltrados, setTurnosFiltrados] = useState([]);
  const [turnosSubTab, setTurnosSubTab] = useState('RESERVADOS');
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [turnosPage, setTurnosPage] = useState(1);
  const [totalTurnosPaginas, setTotalTurnosPaginas] = useState(1);
  const [totalTurnosCount, setTotalTurnosCount] = useState(0);

  const [counts, setCounts] = useState({
    RESERVADOS: 0,
    CONFIRMADOS: 0,
    PROPUESTAS: 0,
    REALIZADOS: 0,
    CANCELADOS: 0
  });

  const ESTADO_MAP = {
    'RESERVADOS': 'RESERVADO',
    'CONFIRMADOS': 'CONFIRMADO',
    'REALIZADOS': 'REALIZADO',
    'CANCELADOS': 'CANCELADO',
    'PROPUESTAS': 'PENDIENTECAMBIO'
  };

  const cargarTodosLosContadores = useCallback(async () => {
    if (!medico?.id) return;
    try {
      const response = await getContadoresTurnos({ medicoId: medico.id });
      const rawCounts = response.data || {};
      setCounts({
        RESERVADOS: rawCounts.RESERVADO || 0,
        CONFIRMADOS: rawCounts.CONFIRMADO || 0,
        PROPUESTAS: rawCounts.PENDIENTECAMBIO || 0,
        REALIZADOS: rawCounts.REALIZADO || 0,
        CANCELADOS: rawCounts.CANCELADO || 0
      });
    } catch (err) {
      console.error("Error al obtener contadores de turnos:", err);
    }
  }, [medico?.id]);

  const cargarTurnosMedico = useCallback(async (estadoTab, paginaActual) => {
    if (!medico?.id) return;
    setLoadingTurnos(true);
    try {
      const estadoMapeado = ESTADO_MAP[estadoTab];
      
      const queryParams = {
        medicoId: medico.id,
        estado: estadoMapeado,
        page: paginaActual,
        limit: 4
      };

      const response = await getMisTurnos(queryParams);
      
      setTurnosFiltrados(response.data || []);
      setTotalTurnosCount(response.paginacion?.totalTurnos || 0);
      setTotalTurnosPaginas(response.paginacion?.totalPaginas || 1);

      setCounts(prev => ({
        ...prev,
        [estadoTab]: response.paginacion?.totalTurnos || 0
      }));

    } catch (err) {
      console.error("Error al obtener turnos del médico:", err);
      setTurnosFiltrados([]);
    } finally {
      setLoadingTurnos(false);
    }
  }, [medico?.id]);

  // Efecto para cargar los contadores iniciales de todas las pestañas
  useEffect(() => {
    if (activeTab === 'turnos' && medico?.id) {
      cargarTodosLosContadores();
    }
  }, [activeTab, medico?.id, cargarTodosLosContadores]);

  // Efecto para cargar el listado del subtab activo
  useEffect(() => {
    if (activeTab === 'turnos' && medico?.id) {
      cargarTurnosMedico(turnosSubTab, turnosPage);
    }
  }, [activeTab, turnosSubTab, turnosPage, medico?.id, cargarTurnosMedico]);

  const handleObtenerHistorialPaciente = useCallback(async (idPaciente) => {
    try {
        const queryParams = { pacienteId: idPaciente, page: 1, limit: 100 };
        const response = await getMisTurnos(queryParams);
        return response.data?.filter(t => ['REALIZADO', 'CANCELADO', 'CONFIRMADO', 'RESERVADO', 'PENDIENTECAMBIO'].includes(t.estado)) || [];
    } catch(err) {
        console.error("Error al obtener historial del paciente:", err);
        return [];
    }
  }, []);

  const handleActualizarEstadoTurno = useCallback(async (idTurno, nuevoEstado, motivo = '', aceptarCambio = false) => {
    setIsFetching(true);
    try {
      if (aceptarCambio) {
          // El paciente acepta el cambio (o el médico acepta si la lógica fuera cruzada)
          await cambiarEstadoTurno(idTurno, 'CONFIRMADO', medico?.id, motivo);
      } else {
          await cambiarEstadoTurno(idTurno, nuevoEstado, medico?.id, motivo);
      }
      await cargarTurnosMedico(turnosSubTab, turnosPage);
      await cargarTodosLosContadores();
      return true;
    } catch (error) {
      console.error(`Error al actualizar estado del turno a ${nuevoEstado}:`, error);
      return false;
    } finally {
      setIsFetching(false);
    }
  }, [cargarTurnosMedico, cargarTodosLosContadores, turnosSubTab, turnosPage, medico?.id]);

  const handleProponerCambioTurno = useCallback(async (idTurno, nuevaFechaHora) => {
    setIsFetching(true);
    try {
      await solicitarCambioFecha(idTurno, nuevaFechaHora, medico?.id);
      await cargarTurnosMedico(turnosSubTab, turnosPage);
      await cargarTodosLosContadores();
      return true;
    } catch (error) {
      console.error("Error al proponer cambio de fecha:", error);
      return false;
    } finally {
      setIsFetching(false);
    }
  }, [cargarTurnosMedico, cargarTodosLosContadores, turnosSubTab, turnosPage, medico?.id]);

  return {
    turnosFiltrados,
    turnosSubTab,
    setTurnosSubTab,
    loadingTurnos,
    isFetching,
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
