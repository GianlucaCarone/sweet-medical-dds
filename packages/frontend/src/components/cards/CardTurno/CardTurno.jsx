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
  color: #2d8077;
  padding: 4px;
  font-size: 14px;
  font-weight: 800;
  justify-content: space-between;
`;

const TurnoActions = styled.div`
  display: flex;
  gap: 12px;
`;

// Pro-tip: Así se estilizan componentes de librerías externas (MUI) con styled-components
const BtnSecundario = styled(Button)`
  && {
    border-radius: 999px;
   border: 2px solid #137333;
    color: #137333;
    transition: all 0.2s ease-in-out;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

        &:hover {
      background: #e8f5e9;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(19, 115, 51, 0.15);
    }
  }
`;

const BtnCancelar = styled(Button)`
  && {
    border-radius: 999px;
    background-color: #f36969;
    color: white;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

    &:hover {
      background-color: #dc2626;
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
            {'Cobertura: '}
            {turno.estadoCobertura}
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