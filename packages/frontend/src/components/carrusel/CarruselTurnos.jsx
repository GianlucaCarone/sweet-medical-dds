import React, { useRef } from 'react';
import styled from 'styled-components';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Contenedor principal del carrusel (incluye las flechas)
const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
`;

// Área scrolleable oculta (sin barra de scroll visible)
const ScrollArea = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth; /* Para que el avance con flechas sea suave */
  flex: 1;
  padding: 4px 0;

  /* Ocultar scrollbar para un look más limpio */
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

const NavButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    background: #f8fafc;
    color: #0f172a;
  }
`;

const BotonTurno = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => (props.$seleccionado ? "#e1f0e1" : "#edf7ed")};
  border: 2px solid ${(props) => (props.$seleccionado ? "#137333" : "transparent")};
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* Evita que el botón se achique en el carrusel */
  min-width: 80px;

  &:hover {
    background-color: #e1f0e1;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .fecha {
    font-size: 11px;
    color: #1e4620;
    margin-bottom: 4px;
  }

  .hora {
    font-size: 14px;
    font-weight: 800;
    color: #137333;
  }
`;

export default function CarruselTurnos({ turnos, turnoSeleccionado, onSelectTurno, estaEnCarrito }) {
  const scrollRef = useRef(null);

  // Función para mover el scroll del carrusel con las flechas
  const scroll = (offset) => {
    const turnoscopia = turnos;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += offset;
    }
  };

  const formatoHorario = (isoString) => {
    const fecha = new Date(isoString);
    return {
      fecha: fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }),
      hora: fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Si no hay turnos, evitamos renderizar el carrusel vacío
  if (!turnos || turnos.length === 0) return <p>No hay turnos disponibles.</p>;

  return (
    <CarouselContainer>
      {/* Botón Izquierda */}
      <NavButton onClick={() => scroll(-150)}>
        <ChevronLeftIcon fontSize="small" />
      </NavButton>

      {/* Lista de turnos */}
      <ScrollArea ref={scrollRef}>
        {turnos.map((t) => {
          const { fecha, hora } = formatoHorario(t.horario);
          const isSeleccionado = turnoSeleccionado === t.id;
          const isDeshabilitado = estaEnCarrito(t.id);

          return (
            <BotonTurno id={t.id}
              key={t.id}
              $seleccionado={isSeleccionado}
              disabled={isDeshabilitado}
              onClick={() => !isDeshabilitado && onSelectTurno(t.id)}
            >
              <EventNoteIcon fontSize="small" style={{ marginBottom: '4px' }} />
              <span className="fecha">{fecha}</span>
              <span className="hora">{hora}</span>
            </BotonTurno>
          );
        })}
      </ScrollArea>

      {/* Botón Derecha */}
      <NavButton onClick={() => scroll(150)}>
        <ChevronRightIcon fontSize="small" />
      </NavButton>
    </CarouselContainer>
  );
}