import React, { use } from 'react';
import { useEffect, useState, useCallback, useRef } from "react";
import SidebarFiltros from '../../components/busqueda-turnos/sidebarFiltros.jsx';
import TarjetaTurno from '../../components/busqueda-turnos/tarjetaTurno.jsx';
import TarjetaTurnoSkeleton from '../../components/busqueda-turnos/tarjetaTurnoSkeleton.jsx';
import Pagination from '@mui/material/Pagination';
import { turnosEjemplo, datosPaginacionEjemplo } from '../../mockdata/turnos.js';
import { medicosEjemplo, especialidadesEjemplo, practicasEjemplo, sedesEjemplo } from '../../mockdata/busquedaTurnos.js';
import { getTurnosDisponiblesFiltradoPaginado, getListadoMedicos, getListadoEspecialidades, getListadoPracticas, getListadoSedes, getListadoServicios, getPacienteByIdUsuario } from '../../api/api.js';
import './busquedaTurnos.css';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import TituloSeccion from "../../shared/TituloSeccion/TituloSeccion.jsx"

export default function BusquedaTurnos() {
    const { user } = useAuth();

    //datos para los filtros:
                                        // TODO usar el auth context para recuperar al usuario
    const [pacienteID, setPacienteID] = useState(null); //por ahora; hasta tener el login
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [practicas, setPracticas] = useState([]);
    const [sedes, setSedes] = useState([]);
    //los turnos en si:
    const [turnos, setTurnos] = useState([]);
    const [conjuntosTurnos, setConjuntosTurnos] = useState([]);
    const [dataPaginacion, setDataPaginacion] = useState({limitePorPagina: 5});
    const [numeroPagina, setNumeroPagina] = useState(1);
    //funcionamiento general de la vista:
    const yaCargado = useRef(false);
    const [ordenarPor, setOrdenarPor] = useState("ordenPorFecha");
    const [loading, setLoading] = useState(true);
    const [sinResultados, setSinResultados] = useState(false);
    const filtrosActualesRef = useRef({});
    const {manejoCarritoDrawer, agregarAlCarrito} = useCart();

    const crearConjuntosTurnos = (turnos) => {
        const mapa = new Map();
        turnos.forEach((turno) => {
            const clave = [
                turno.medico?._id,
                turno.servicio?._id,
                turno.sede?._id,
                turno.costo,
                turno.estadoCobertura,
            ].join("|");
            if (!mapa.has(clave)) {
                mapa.set(clave, {
                    medico: turno.medico,
                    servicio: turno.servicio,
                    sede: turno.sede,
                    costo: turno.costo,
                    estadoCobertura: turno.estadoCobertura,
                    turnos: [],
                });
            }
            mapa.get(clave).turnos.push({
                id: turno.id,
                horario: turno.fechaHora,
            });
        });
        return Array.from(mapa.values());
    };

    const cargarListados = async () => {
        try {
            //const pacienteId = await getPacienteByIdUsuario(user.id);
            const listadoMedicos = await getListadoMedicos();
            const listadoServicios = await getListadoServicios();
            const listadoEspecialidades = listadoServicios.filter(s => s.tipo === 'Especialidad');
            const listadoPracticas = listadoServicios.filter(s => s.tipo === 'Practica');
            const listadoSedes = await getListadoSedes();
            
            //setPacienteID(pacienteId);
            setMedicos(listadoMedicos);
            setEspecialidades(listadoEspecialidades);
            setPracticas(listadoPracticas);
            setSedes(listadoSedes);
        } catch (e) {
            console.error("Error cargando listados:", e);
        }
    };

    const nuevosFiltros = async (filtrosInput = {}) => {
        filtrosActualesRef.current = filtrosInput;
        cargarTurnos(filtrosInput);
    };

    const cargarTurnos = useCallback(async (filtrosInput = {}, pagina = numeroPagina, orden = ordenarPor) => {
        setLoading(true);
        setTimeout(() => setLoading(false), 200);
        setSinResultados(false);
        const page = { 
            'page': pagina
        };
        const filtrosCompletos = {
            ...filtrosInput,
            estado: 'DISPONIBLE',
            // pacienteId: pacienteID,
            orden: "asc"
        };
        if (pacienteID != null) filtrosCompletos.pacienteId = pacienteID
        const turnosFiltrados = await getTurnosDisponiblesFiltradoPaginado(filtrosCompletos, page);
        setTurnos(turnosFiltrados.data);
        if (turnosFiltrados.data.length === 0) setSinResultados(true);
        setConjuntosTurnos(crearConjuntosTurnos(turnosFiltrados.data));
        setDataPaginacion(turnosFiltrados.paginacion);
        setLoading(false);
    }, [ordenarPor, numeroPagina, pacienteID]);

    const agregarAlCarritoTurno = (id) => {
        const turno = turnos.find(t => t.id === id);
        agregarAlCarrito(turno);
        manejoCarritoDrawer.abrir();
    };

    useEffect(() => { //renderizado inicial
        if (yaCargado.current) return;
        yaCargado.current = true;

        const cargarTodo = async () => {
            await cargarListados();
            await cargarTurnos();
        };

        cargarTodo();
    }, []);

    return (
        <div className="container-busqueda">

            {/* Sidebar de filtros desarrollado con Material UI */}
            <SidebarFiltros
                medicos={medicos}
                sedes={sedes}
                especialidades={especialidades}
                practicas={practicas}
                nuevosFiltros={nuevosFiltros}
            />

            {/* Contenedor de Resultados */}
            <main className="contenido-resultados">
                <header className="header-resultados">
                    <TituloSeccion>{dataPaginacion.totalTurnos} turno/s disponible/s</TituloSeccion>
                    <div className="ordenar-por">
                        <label>Ordenar por:</label>
                        <select defaultValue="ordenPorFecha" onChange={(e) => {
                                setOrdenarPor(e.target.value);
                                cargarTurnos(filtrosActualesRef.current, null, e.target.value);
                            }}>
                            <option value="ordenPorFecha">Fecha (más próximos)</option>
                            <option value="ordenPorCosto">Costo (más barato)</option>
                        </select>
                    </div>
                </header>

                {/* Listado dinámico de las tarjetas de turnos */}
                <section className="lista-turno">
                    {loading
                        ? Array.from({ length: dataPaginacion.limitePorPagina }).map((_, i) => ( //que la cantidad de skeletons sea igual al tamaño de pagina
                            <TarjetaTurnoSkeleton key={i} />
                        ))
                        : conjuntosTurnos.map((turno) => (
                            <TarjetaTurno
                                key={turno.id}
                                turno={turno}
                                especialidades={especialidades}
                                practicas={practicas}
                                onReservar={agregarAlCarritoTurno}
                            />
                        ))}
                </section>
                <Pagination count={dataPaginacion.totalPaginas} color="primary"
                    page={numeroPagina}
                    onChange={(e, page) => {
                        setNumeroPagina(page);
                        cargarTurnos(filtrosActualesRef.current, page);
                    }}
                />
            </main>
        </div>
    );
}