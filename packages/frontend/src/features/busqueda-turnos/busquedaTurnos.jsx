import React from 'react';
import { useEffect, useState, useCallback, useRef } from "react";
import SidebarFiltros from '../../components/busqueda-turnos/sidebarFiltros.jsx';
import TarjetaTurno from '../../components/busqueda-turnos/tarjetaTurno.jsx';
import TarjetaTurnoSkeleton from '../../components/busqueda-turnos/tarjetaTurnoSkeleton.jsx';
import Pagination from '@mui/material/Pagination';
import { getTurnosDisponiblesFiltradoPaginado } from '../../api/apiBusquedaTurnos.js';
import './busquedaTurnos.css';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import TituloSeccion from "../../shared/TituloSeccion/TituloSeccion.jsx"
import { useFilters } from '../../context/FilterContext.jsx';
import { Typography } from '@mui/material';
import TurnosEmptyState from '../../components/mis-turnos/TurnosEmptyState.jsx';
import ModalLogin from "../../components/login/ModalLogin.jsx";
import { useNavigate, Navigate } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";

export default function BusquedaTurnos() {
    const { user } = useAuth();
    const { doctors, specialities, practices, branches, buildApiFilters, specialityFilter } = useFilters();
    const { manejoCarritoDrawer, agregarAlCarrito } = useCart();
    const navigate = useNavigate();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [turnoPendienteReserva, setTurnoPendienteReserva] = useState(null);

    const [turnos, setTurnos] = useState([]);
    const [turnGroups, setTurnGroups] = useState([]);
    const [paginationData, setPaginationData] = useState({ numeroPagina: 1, limitePorPagina: 5, totalPaginas: 1, totalTurnos: 0 });
    const [sortBy, setSortBy] = useState("ordenPorFecha");
    const yaCargado = useRef(false);
    const [loading, setLoading] = useState(true);
    const [noResults, setNoResults] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const isSpecialitySelected = specialityFilter && specialityFilter !== 'Todas';

    const createTurnGroups = (turnos) => {
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

    const fetchTurns = async (
      filtersInput = buildApiFilters(),
      page = 1,
      order = sortBy
    ) => {
      setLoading(true);
      setTimeout(() => setLoading(false), 200);
      setNoResults(false);

      const pageParam = {
        page: page,
      };
      const completeFilters = {
        ...filtersInput,
        estado: 'DISPONIBLE',
        [order]: 'asc',
      };
      
        try {
            const response = await getTurnosDisponiblesFiltradoPaginado(completeFilters, pageParam);
            setTurnos(response.data);
            setNoResults(response.data.length === 0);
            setTurnGroups(createTurnGroups(response.data));
            setPaginationData(response.paginacion);
            setHasSearched(true);
        } catch (e) {
            const fueManejado = handleApiError(e, navigate);
                
            if (!fueManejado) {
                console.error("Error fetching turns:", e);
            }
        } finally {
            setLoading(false);
        }
    };

    const addTurnToCart = (id) => {
      if (!user) {
        setTurnoPendienteReserva(id);
        setLoginModalOpen(true);
        return;
      }

      const turno = turnos.find((t) => t.id === id);
      agregarAlCarrito(turno);
      manejoCarritoDrawer.abrir();
    };

    useEffect(() => {
      const initialFilters = buildApiFilters();
      if (isSpecialitySelected) {
        fetchTurns(initialFilters);
      } else {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if (!isSpecialitySelected) {
        setTurnos([]);
        setTurnGroups([]);
        setNoResults(false);
        setPaginationData({ numeroPagina: 1, limitePorPagina: 5, totalPaginas: 1, totalTurnos: 0 });
        setHasSearched(false);
      }
    }, [isSpecialitySelected]);

    if (user?.rol === 'MEDICO') {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="container-busqueda">
        <SidebarFiltros onSearch={() => fetchTurns(buildApiFilters())} />

        <main className="contenido-resultados">
          {hasSearched && (
            <header className="header-resultados">
              <TituloSeccion>
                {paginationData.totalTurnos}{' '}
                {paginationData.totalTurnos == 1 ? 'Turno disponible' : 'Turnos disponibles'}
              </TituloSeccion>
              <div className="ordenar-por">
                <label>Ordenar por:</label>
                <select
                  defaultValue="ordenPorFecha"
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    fetchTurns(buildApiFilters(), 1, e.target.value);
                  }}
                >
                  <option value="ordenPorFecha">Fecha (más próximos)</option>
                  <option value="ordenPorCosto">Costo (más barato)</option>
                </select>
              </div>
            </header>
          )}

          <section className="lista-turno">
            {loading
              ? Array.from({ length: paginationData.limitePorPagina }).map((_, i) => (
                  <TarjetaTurnoSkeleton key={i} />
                ))
              : hasSearched && turnGroups.map((turno) => (
                  <TarjetaTurno
                    key={turno.id}
                    turno={turno}
                    especialidades={specialities}
                    practicas={practices}
                    onReservar={addTurnToCart}
                  />
                ))}
          </section>
          {!hasSearched ? (
            <TurnosEmptyState
              titulo="Comenzá tu búsqueda"
              descripcion="Por favor, seleccioná una especialidad en los filtros para ver los turnos disponibles."
              textoBoton={null}
              onClick={null}
            />
          ) : noResults ? (
            <TurnosEmptyState
              titulo="No se encontró ningún turno"
              descripcion="Intentá cambiar tus filtros de busqueda"
              textoBoton={null}
              onClick={null}
            />
          ) : (
            <Pagination
              color="#137333"
              count={paginationData.totalPaginas}
              page={paginationData.numeroPagina}
              onChange={(e, page) => {
                fetchTurns(buildApiFilters(), page, sortBy);
              }}
            />
          )}
        </main>

        <ModalLogin
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={() => {
            setLoginModalOpen(false);

            if (turnoPendienteReserva) {
              const turno = turnos.find((t) => t.id === turnoPendienteReserva);

              if (turno) {
                agregarAlCarrito(turno);
                manejoCarritoDrawer.abrir();
              }

              setTurnoPendienteReserva(null);
            }
          }}
        />
      </div>
    );
}
