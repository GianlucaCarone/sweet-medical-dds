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
import Toast from '../../components/mis-turnos/Toast';
import { mockRespuestaPaginada, historialTurnos } from '../../mockdata/turnos';
import TituloSeccion from '../../shared/TituloSeccion/TituloSeccion';
import { Button } from '@mui/material';
import CardBase from '../../shared/CardBase/CardBase'
import Pagination from '@mui/material/Pagination';
// Contextos y hooks
import { useAlert } from "../../context/AlertContext.jsx";
import TurnoHistorialCard from '../../components/cards/TurnoHistorialCard';
import { getTurnosProximosUsuario, getHistorialUsuario, cancelarTurno } from '../../api/apiMisTurnos.js';
import styled from 'styled-components';

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
  const idUsuario = '6a0b7127da9b7c8a035d969b';
  const [idPaciente, setIdPaciente] = useState('6a0b720ada9b7c8a035d96a9');
  const [paginaProximos, setPaginaProximos] = useState(1);
  const [dataPaginacionProximos, setDataPaginacionProximos] = useState({limitePorPagina: 5})
  const [paginaHistorial, setPaginaHistorial] = useState(1);
  const [dataPaginacionHistorial, setDataPaginacionHistorial] = useState({limitePorPagina: 5});
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [turnosProximos, setTurnosProximos] = useState(mockRespuestaPaginada.data);
  const [turnosHistorial, setTurnosHistorial] = useState(historialTurnos)
  const yaCargado = useRef(false);
  const turnosPorPagina = 3;
  const navigate = useNavigate();

  // accionees alertaContext
  const {showAlert} = useAlert(); 

  const totalPaginasProximos = Math.ceil(
    mockRespuestaPaginada.paginacion.totalTurnos / turnosPorPagina
  );

  const estadisticasData = [
    {
      id: 1,
      numero: dataPaginacionProximos.totalTurnos,
      texto: 'Turnos próximos',
      tipo: 'azul',
      icono: <CalendarMonthRoundedIcon />,
    },
    {
      id: 2,
      numero: '1', // TODO: Traer del backend
      texto: 'Turnos realizados',
      tipo: 'verde',
      icono: <CheckCircleRoundedIcon />,
    },
    {
      id: 3,
      numero: '1', // TODO: Traer del backend
      texto: 'Cancelados',
      tipo: 'rojo',
      icono: <CancelRoundedIcon />,
    },
    {
      id: 4,
      numero: '2', // TODO: Traer del backend
      texto: 'Notif. sin leer',
      tipo: 'naranja',
      icono: <NotificationsRoundedIcon />,
    },
  ];

  const handleTurnoCancelado = async (turnoId, motivo) => {
    console.log('Turno cancelado:', turnoId, motivo);
    const response = cancelarTurno(turnoId, motivo, idUsuario);
    setTurnosProximos(turnosProximos.filter((t) => t.id != turnoId));

    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  };

  const cargarProximosTurnos = async (page = paginaProximos) => {
    try {
      const paginacion = {
        'page': page,
        'limit': dataPaginacionProximos.limitePorPagina
      }
      const proximosTurnos = await getTurnosProximosUsuario(idPaciente, paginacion);
      setTurnosProximos(proximosTurnos.data);
      setDataPaginacionProximos(proximosTurnos.paginacion);
    } catch (error) {
      console.error("Error cargando turnos proximos:", error);
    }
  }

  const cargarHistorialTurnos = async (page = paginaHistorial) => {
    try {
      const paginacion = {
        'page': page,
        'limit': dataPaginacionHistorial.limitePorPagina
      }
      const historialPaginado = await getHistorialUsuario(idPaciente, paginacion);
      setTurnosHistorial(historialPaginado.data);
      setDataPaginacionHistorial(historialPaginado.paginacion);
      setLoading(false)
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  }

  useEffect(() => { //renderizado inicial
    if (yaCargado.current) return;
    yaCargado.current = true;

    const cargarTodo = async () => {
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
            Tenés <strong>{turnosProximos.length}</strong> turnos próximos programados.
            Desde acá podés consultar, reprogramar o cancelar tus citas médicas.
          </p>
        </div>
      </StyledTarjetaWrapper>

      <Toast visible={toastVisible} mensaje="Turno cancelado correctamente." />

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
                key={stat.id}
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
              <CardTurno key={turno.id} turno={turno} onCancelar={handleTurnoCancelado} />
            ))}
          </div>

          {totalPaginasProximos > 1 && (
            <div className="paginacion-turnos">
              <Button
                disabled={paginaProximos === 1}
                onClick={() => setPaginaProximos(paginaProximos - 1)}
              >
                Anterior
              </Button>

              <span>
                Página {paginaProximos} de {totalPaginasProximos}
              </span>

              <Button
                disabled={paginaProximos === totalPaginasProximos}
                onClick={() => setPaginaProximos(paginaProximos + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}

          <Pagination color="#137333"
            count={dataPaginacionProximos.totalPaginas} 
            page={paginaProximos}
            onChange={(e, page) => {
              setPaginaProximos(page);
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
            page={paginaHistorial}
            onChange={(e, page) => {
                setPaginaHistorial(page);
                cargarHistorialTurnos(page);
            }}
          />
        </>
      )}
    </section>
  );
}
