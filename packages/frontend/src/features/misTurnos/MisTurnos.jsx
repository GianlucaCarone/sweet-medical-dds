import './MisTurnos.css';
import CardTurno from '../../components/cards/CardTurno/CardTurno';
import EstadisticaTurnoCard from '../../components/mis-turnos/EstadisticaTurnoCard';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useState, useEffect, useRef } from 'react';
import TurnosEmptyState from '../../components/mis-turnos/TurnosEmptyState';
import TurnoCardSkeleton from '../../components/mis-turnos/TurnoCardSkeleton';
import EstadisticaTurnoCardSkeleton from '../../components/mis-turnos/EstadisticaTurnoCardSkeleton';
import TurnoHistorialSkeleton from '../../components/mis-turnos/TurnoHistorialSkeleton';
import { useNavigate } from 'react-router-dom';
import { mockRespuestaPaginada, historialTurnos } from '../../mockdata/turnos';
import TituloSeccion from '../../shared/TituloSeccion/TituloSeccion';
import { Button } from '@mui/material';
import CardBase from '../../shared/CardBase/CardBase'
import Pagination from '@mui/material/Pagination';
// Contextos y hooks
import { useAlert } from "../../context/AlertContext.jsx";
import TurnoHistorialCard from '../../components/cards/TurnoHistorialCard';
import { getMisTurnos, cambiarEstadoTurno, solicitarCambioFecha, getContadoresTurnos } from '../../api/turno.js';
import styled from 'styled-components';
import { handleApiError } from "../../utils/handleApiError";

const StyledTarjetaWrapper = styled(CardBase)`
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px; 
  align-items: stretch;
`;

export default function MisTurnos() {
  const [counts, setCounts] = useState({
    RESERVADOS: 0,
    CONFIRMADOS: 0,
    PROPUESTAS: 0,
    REALIZADOS: 0,
    CANCELADOS: 0
  });
  const [dataPaginacionProximos, setDataPaginacionProximos] = useState({page: 1, limitePorPagina: 4})
  const [dataPaginacionHistorial, setDataPaginacionHistorial] = useState({page: 1, limitePorPagina: 5});
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [turnosProximos, setTurnosProximos] = useState(mockRespuestaPaginada.data);
  const [turnosHistorial, setTurnosHistorial] = useState(historialTurnos);
  const yaCargado = useRef(false);
  const turnosPorPagina = 3;
  const navigate = useNavigate();

  // accionees alertaContext
  const {showAlert} = useAlert(); 

  const estadisticasData = [
    {
      numero: counts.RESERVADOS + counts.CONFIRMADOS + counts.PROPUESTAS,
      texto: 'Turnos próximos',
      tipo: 'azul',
      icono: <CalendarMonthRoundedIcon />,
    },
    {
      numero: counts.REALIZADOS,
      texto: 'Turnos realizados',
      tipo: 'verde',
      icono: <CheckCircleRoundedIcon />,
    },
    {
      numero: counts.CANCELADOS,
      texto: 'Cancelados',
      tipo: 'rojo',
      icono: <CancelRoundedIcon />,
    },
    {
      numero: counts.PROPUESTAS,
      texto: 'Turnos pendientes de revision',
      tipo: 'naranja',
      icono: <NotificationsRoundedIcon />,
    },
  ];

  const handleTurnoCancelado = async (turnoId, motivo) => {
    try {
      await cambiarEstadoTurno(turnoId, 'CANCELADO', motivo);
      setTurnosProximos(turnosProximos.filter((t) => t.id != turnoId));
      showAlert("Tu turno fue cancelado correctamente.", "success");
    } catch (e) {
      showAlert("Hubo un error al cancelar el turno.", "error");
    }
  };

  const handleTurnoAceptado = async (turnoId) => {
    try {
      await cambiarEstadoTurno(turnoId, 'CONFIRMADO', 'Cambio aceptado por paciente');
      // Actualizamos localmente el estado del turno
      setTurnosProximos(turnosProximos.map(t => 
        t.id === turnoId ? { ...t, estado: 'CONFIRMADO' } : t
      ));
      showAlert("Cambio de turno aceptado correctamente.", "success");
    } catch (e) {
      showAlert("Hubo un error al aceptar el cambio.", "error");
    }
  };

  const handleTurnoReprogramado = async (turnoId, nuevaFechaHora) => {
    try {
      const response = await solicitarCambioFecha(turnoId, nuevaFechaHora);
      // Actualizamos localmente el estado del turno (backend devuelve el turno actualizado en data)
      const turnoActualizado = response.data;
      setTurnosProximos(turnosProximos.map(t => 
        t.id === turnoId ? { ...t, estado: 'PENDIENTECAMBIO', fechaHoraPropuesta: nuevaFechaHora, historialEstado: turnoActualizado?.historialEstado || t.historialEstado } : t
      ));
      showAlert("Propuesta de cambio enviada correctamente.", "success");
    } catch (e) {
      showAlert("Hubo un error al enviar la propuesta.", "error");
    }
  };

  const cargarTodosLosContadores = async () => {
    try {
      const response = await getContadoresTurnos();
      const rawCounts = response.data || {};
      setCounts({
        RESERVADOS: rawCounts.RESERVADO || 0,
        CONFIRMADOS: rawCounts.CONFIRMADO || 0,
        PROPUESTAS: rawCounts.PENDIENTECAMBIO || 0,
        REALIZADOS: rawCounts.REALIZADO || 0,
        CANCELADOS: rawCounts.CANCELADO || 0
      });
    } catch (err) {
      const fueManejado = handleApiError(err, navigate);
      if (!fueManejado) {
        console.error("Error al obtener contadores de turnos:", err);
      }
    }
  };

  const cargarProximosTurnos = async (page = dataPaginacionProximos.page) => {
    try {
      const paginacion = {
        'page': page,
        'limit': dataPaginacionProximos.limitePorPagina
      }
      const proximosTurnos = await getMisTurnos({
        estados: ['CONFIRMADO', 'RESERVADO', 'PENDIENTECAMBIO'],
        fechaHoraInicio: new Date(),
        ordenPorFecha: 'asc',
        ...paginacion
      });
      setTurnosProximos(proximosTurnos.data);
      setDataPaginacionProximos(proximosTurnos.paginacion);
    } catch (error) {
      const fueManejado = handleApiError(error, navigate);
      if (!fueManejado) {
        console.error("Error cargando turnos proximos:", error);
      }
    }
  }

  const cargarHistorialTurnos = async (page = dataPaginacionHistorial.page) => {
    try {
      const paginacion = {
        'page': page,
        'limit': dataPaginacionHistorial.limitePorPagina
      }
      const historialPaginado = await getMisTurnos({
        estados: ['REALIZADO', 'CANCELADO'],
        ordenPorFecha: 'asc',
        ...paginacion
      });
      setTurnosHistorial(historialPaginado.data);
      setDataPaginacionHistorial(historialPaginado.paginacion);
      setLoading(false)
    } catch (error) {
      const fueManejado = handleApiError(error, navigate);
      if (!fueManejado) {
        console.error("Error cargando historial:", error);
      }
    }
  }

  useEffect(() => { //renderizado inicial
    if (yaCargado.current) return;
    yaCargado.current = true;

    const cargarTodo = async () => {
      await cargarTodosLosContadores()
      await cargarProximosTurnos();
      await cargarHistorialTurnos();
    };

    cargarTodo();
  }, []);

  return (
    <section className="mis-turnos-page">
      <TituloSeccion>Mis Turnos</TituloSeccion>
      <StyledTarjetaWrapper>
        <div className="header-content">
          <span className="saludo">
            👋 Hola, <strong color="primary">Usuario</strong>
          </span>

          <p>
            Tenés <strong>{counts.CONFIRMADOS}</strong> turnos próximos programados confirmados.
            Desde acá podés consultar, reprogramar o cancelar tus citas médicas.
          </p>
        </div>
      </StyledTarjetaWrapper>

      <StatsGrid>
        {loading
          ? /* 3. Generamos los Skeletons dinámicamente. 
                       Array.from crea un arreglo de 4 posiciones vacías para mapear */
            Array.from({ length: 4 }).map((_, index) => (
              <EstadisticaTurnoCardSkeleton key={index} />
            ))
          : /* 4. Mapeamos nuestra data real */
            estadisticasData.map((stat) => (
              <EstadisticaTurnoCard
                numero={stat.numero}
                texto={stat.texto}
                tipo={stat.tipo}
                icono={stat.icono}
              />
            ))}
      </StatsGrid>

      <TituloSeccion>Próximos Turnos</TituloSeccion>

      {loading ? (
        <>
          <TurnoCardSkeleton />
          <TurnoCardSkeleton />
          <TurnoCardSkeleton />
        </>
      ) : turnosProximos.length === 0 ? (
        <TurnosEmptyState
          titulo="No tenés turnos próximos"
          descripcion="Cuando reserves un turno, lo vas a ver listado en esta sección."
          textoBoton="Reservar un turno"
          onClick={() => navigate('/busqueda-turnos')}
        />
      ) : (
        <>
          <div className="turnos-lista">
            {turnosProximos.map((turno) => (
              <CardTurno key={turno.id} turno={turno} onCancelar={handleTurnoCancelado} onAceptar={handleTurnoAceptado} onReprogramar={handleTurnoReprogramado} />
            ))}
          </div>

          {/*dataPaginacionProximos.totalPaginas > 1 && (
            <div className="paginacion-turnos">
              <Button
                disabled={paginaProximos === 1}
                onClick={() => setPaginaProximos(paginaProximos - 1)}
              >
                Anterior
              </Button>

              <span>
                Página {paginaProximos} de {dataPaginacionProximos.totalPaginas}
              </span>

              <Button
                disabled={paginaProximos === dataPaginacionProximos.totalPaginas}
                onClick={() => setPaginaProximos(paginaProximos + 1)}
              >
                Siguiente
              </Button>
            </div>
          )*/}

          <Pagination color="#137333"
            count={dataPaginacionProximos.totalPaginas} 
            page={dataPaginacionProximos.page}
            onChange={(e, page) => {
              cargarProximosTurnos(page);
            }}
          />
        </>
      )}

      <TituloSeccion>Historial</TituloSeccion>

      {loading ? (
        <>
          <TurnoHistorialSkeleton />
          <TurnoHistorialSkeleton />
          <TurnoHistorialSkeleton />
        </>
      ) : turnosHistorial.length === 0 ? (
        <div className="historial-empty-state">
          <span>📋</span>
          <p>No tenés turnos previos.</p>
        </div>
      ) : (
        <>
          <div className="turnos-lista">
            {turnosHistorial.map((turno) => (
              <TurnoHistorialCard key={turno.id} turno={turno} />
            ))}
          </div>

          <Pagination color="#137333"
            count={dataPaginacionHistorial.totalPaginas} 
            page={dataPaginacionHistorial.page}
            onChange={(e, page) => {
                cargarHistorialTurnos(page);
            }}
          />
        </>
      )}
    </section>
  );
}
