import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import CancelarTurnoModal from '../../mis-turnos/CancelarTurnoModal.jsx';
import ReprogramarTurnoModal from '../../mis-turnos/ReprogramarTurnoModal.jsx';
import TurnoCardLayout from '../../../shared/TurnoCardLayout.jsx';

// --- 1. Styled Components ---
const TurnoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CoberturaLabel = styled.div`
  display: inline-flex;
  color: var(--color-primary);
  padding: 4px;
  font-size: 14px;
  font-weight: 800;
  justify-content: space-between;
`;

const TurnoActions = styled.div`
  display: flex;
  gap: 12px;
`;

const BtnSecundario = styled(Button)`
  && {
    border-radius: 999px;
    border: 2px solid var(--color-success-dark);
    color: var(--color-success-dark);
    transition: all 0.2s ease-in-out;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

    &:hover {
      background: var(--color-success-light);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(19, 115, 51, 0.15);
    }
  }
`;

const BtnCancelar = styled(Button)`
  && {
    border-radius: 999px;
    background-color: var(--color-error);
    color: white;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

    &:hover {
      background-color: var(--color-error-dark);
      transform: translateY(-1px);
    }
  }
`;

// --- 2. Componente Principal ---
export default function CardTurno({ turno, onCancelar }) {
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [modalReprogramarAbierto, setModalReprogramarAbierto] = useState(false);

  const confirmarReprogramacion = (turnoId, nuevoTurno) => {
    console.log('Reprogramando turno:', turnoId, 'Nuevo horario:', nuevoTurno);
    setModalReprogramarAbierto(false);
  };

  const confirmarCancelacion = (motivo) => {
    if (onCancelar) onCancelar(turno.id, motivo);
    setModalCancelarAbierto(false);
  };

  return (
    <>
      <TurnoCardLayout turno={turno}>
        <TurnoFooter>
          <CoberturaLabel>
            {'Estado: '}
            {turno.estado.toLowerCase()}
          </CoberturaLabel>

          <TurnoActions>
            <BtnSecundario variant="outlined" onClick={() => setModalReprogramarAbierto(true)}>
              Cambiar fecha
            </BtnSecundario>

            <BtnCancelar variant="contained" onClick={() => setModalCancelarAbierto(true)}>
              Cancelar
            </BtnCancelar>
          </TurnoActions>
        </TurnoFooter>
      </TurnoCardLayout>

      <ReprogramarTurnoModal
        abierto={modalReprogramarAbierto}
        turno={turno}
        onCerrar={() => setModalReprogramarAbierto(false)}
        onConfirmar={confirmarReprogramacion}
      />

      <CancelarTurnoModal
        abierto={modalCancelarAbierto}
        onCerrar={() => setModalCancelarAbierto(false)}
        onConfirmar={confirmarCancelacion}
      />
    </>
  );
}