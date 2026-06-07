import "./MisTurnos.css";
import TurnoCard from "../../components/turnos/TurnoCard";
import EstadisticaTurnoCard from "../../components/turnos/EstadisticaTurnoCard";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useState, useEffect } from "react";
import TurnosEmptyState from "../../components/turnos/TurnosEmptyState";
import TurnoCardSkeleton from "../../components/turnos/TurnoCardSkeleton";
import EstadisticaTurnoCardSkeleton from "../../components/turnos/EstadisticaTurnoCardSkeleton";
import TurnoHistorialSkeleton from "../../components/turnos/TurnoHistorialSkeleton";

const proximosTurnos = [
    {
        id: 1,
        doctor: "Dra. Ana López",
        foto: "https://randomuser.me/api/portraits/women/68.jpg",
        especialidad: "Cardiología",
        fecha: "Lunes, 1 de Junio de 2026",
        hora: "10:00 hs",
        sede: "Av. Cabildo 1234, CABA",
        cobertura: "OSDE 210 - Sin cargo",
        estado: "CONFIRMADO",
    },
    /*
{
    id: 2,
    doctor: "Dra. Camila Ibáñez",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    especialidad: "Dermatología",
    fecha: "Lunes, 15 de Junio de 2026",
    hora: "12:00 hs",
    sede: "Sede Palermo",
    cobertura: "Cobertura parcial · Abonás $4.200",
    estado: "RESERVADO",
},
{
    id: 3,
    doctor: "Dra. Ana López",
    foto: "https://randomuser.me/api/portraits/women/68.jpg",
    especialidad: "Cardiología",
    fecha: "Lunes, 1 de Junio de 2026",
    hora: "10:00 hs",
    sede: "Av. Cabildo 1234, CABA",
    cobertura: "OSDE 210 - Sin cargo",
    estado: "CONFIRMADO",
},
{
id: 4,
doctor: "Dra. Camila Ibáñez",
foto: "https://randomuser.me/api/portraits/women/44.jpg",
especialidad: "Dermatología",
fecha: "Lunes, 15 de Junio de 2026",
hora: "12:00 hs",
sede: "Sede Palermo",
cobertura: "Cobertura parcial · Abonás $4.200",
estado: "RESERVADO",
},
{
id: 5,
doctor: "Dra. Ana López",
foto: "https://randomuser.me/api/portraits/women/68.jpg",
especialidad: "Cardiología",
fecha: "Lunes, 1 de Junio de 2026",
hora: "10:00 hs",
sede: "Av. Cabildo 1234, CABA",
cobertura: "OSDE 210 - Sin cargo",
estado: "CONFIRMADO",
},
{
id: 6,
doctor: "Dra. Camila Ibáñez",
foto: "https://randomuser.me/api/portraits/women/44.jpg",
especialidad: "Dermatología",
fecha: "Lunes, 15 de Junio de 2026",
hora: "12:00 hs",
sede: "Sede Palermo",
cobertura: "Cobertura parcial · Abonás $4.200",
estado: "RESERVADO",
},
{
id: 7,
doctor: "Dra. Camila Ibáñez",
foto: "https://randomuser.me/api/portraits/women/44.jpg",
especialidad: "Dermatología",
fecha: "Lunes, 15 de Junio de 2026",
hora: "12:00 hs",
sede: "Sede Palermo",
cobertura: "Cobertura parcial · Abonás $4.200",
estado: "RESERVADO",
}
*/
];

const historialTurnos = [

    {
        id: 10,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 11,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 12,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 13,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 14,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
];

export default function MisTurnos() {
    const [paginaProximos, setPaginaProximos] = useState(1);
    const [paginaHistorial, setPaginaHistorial] = useState(1);
    const [loading, setLoading] = useState(true);
    const turnosPorPagina = 3;

    const totalPaginasProximos = Math.ceil(proximosTurnos.length / turnosPorPagina);

    const proximosTurnosAMostrar = proximosTurnos.slice(
        (paginaProximos - 1) * turnosPorPagina,
        paginaProximos * turnosPorPagina
    );

    const totalPaginasHistorial = Math.ceil(historialTurnos.length / turnosPorPagina);

    const historialTurnosAMostrar = historialTurnos.slice(
        (paginaHistorial - 1) * turnosPorPagina,
        paginaHistorial * turnosPorPagina
    );

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <section className="mis-turnos-page">
            <div className="mis-turnos-header">
                <div className="header-content">
                    <span className="saludo">
                        👋 Hola, <strong>Usuario</strong>
                    </span>

                    <h1>Mis Turnos</h1>

                    <p>
                        Tenés <strong>2 turnos próximos</strong> programados. Desde acá podés
                        consultar, reprogramar o cancelar tus citas médicas.
                    </p>
                </div>

                <div className="header-actions">
                    <button className="nuevo-turno-btn">Nuevo turno</button>
                </div>
            </div>

            <div className="stats-grid">
                {loading ? (
                    <>
                        <EstadisticaTurnoCardSkeleton />
                        <EstadisticaTurnoCardSkeleton />
                        <EstadisticaTurnoCardSkeleton />
                        <EstadisticaTurnoCardSkeleton />
                    </>
                ) : (
                    <>
                        <EstadisticaTurnoCard
                            numero="2"
                            texto="Turnos próximos"
                            tipo="azul"
                            icono={<CalendarMonthRoundedIcon />}
                        />

                        <EstadisticaTurnoCard
                            numero="1"
                            texto="Turnos realizados"
                            tipo="verde"
                            icono={<CheckCircleRoundedIcon />}
                        />

                        <EstadisticaTurnoCard
                            numero="1"
                            texto="Cancelados"
                            tipo="rojo"
                            icono={<CancelRoundedIcon />}
                        />

                        <EstadisticaTurnoCard
                            numero="2"
                            texto="Notif. sin leer"
                            tipo="naranja"
                            icono={<NotificationsRoundedIcon />}
                        />
                    </>
                )}
            </div>

            <h2 className="section-title">Próximos Turnos</h2>

            {loading ? (
                <>
                    <TurnoCardSkeleton />
                    <TurnoCardSkeleton />
                    <TurnoCardSkeleton />
                </>
            ) : proximosTurnos.length === 0 ? (
                <TurnosEmptyState
                    titulo="No tenés turnos próximos"
                    descripcion="Cuando reserves un turno, lo vas a ver listado en esta sección."
                    textoBoton="Reservar un turno"
                />
            ) : (
                <>
                    <div className="turnos-lista">
                        {proximosTurnosAMostrar.map((turno) => (
                            <TurnoCard key={turno.id} turno={turno} />
                        ))}
                    </div>

                    {totalPaginasProximos > 1 && (
                        <div className="paginacion-turnos">
                            <button
                                disabled={paginaProximos === 1}
                                onClick={() => setPaginaProximos(paginaProximos - 1)}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {paginaProximos} de {totalPaginasProximos}
                            </span>

                            <button
                                disabled={paginaProximos === totalPaginasProximos}
                                onClick={() => setPaginaProximos(paginaProximos + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}

            <h2 className="section-title historial-title">Historial</h2>

            {loading ? (
                <>
                    <TurnoHistorialSkeleton />
                    <TurnoHistorialSkeleton />
                    <TurnoHistorialSkeleton />
                </>
            ) : historialTurnos.length === 0 ? (
                <div className="historial-empty-state">
                    <span>📋</span>
                    <p>No tenés turnos previos.</p>
                </div>
            ) : (
                <>
                    <div className="turnos-lista">
                        {historialTurnosAMostrar.map((turno) => (
                            <TurnoCard
                                key={turno.id}
                                turno={turno}
                                esHistorial
                            />
                        ))}
                    </div>

                    {totalPaginasHistorial > 1 && (
                        <div className="paginacion-turnos">
                            <button
                                disabled={paginaHistorial === 1}
                                onClick={() => setPaginaHistorial(paginaHistorial - 1)}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {paginaHistorial} de {totalPaginasHistorial}
                            </span>

                            <button
                                disabled={paginaHistorial === totalPaginasHistorial}
                                onClick={() => setPaginaHistorial(paginaHistorial + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}


        </section>
    );
}