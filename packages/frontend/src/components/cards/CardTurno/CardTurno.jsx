import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import CancelarTurnoModal from '../../mis-turnos/CancelarTurnoModal.jsx';
import ReprogramarTurnoModal from '../../mis-turnos/ReprogramarTurnoModal.jsx';
import TurnoCardLayout from '../../../shared/TurnoCardLayout.jsx';
import Tooltip from "@mui/material/Tooltip";

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
    background-color: var(--color-success-dark);
    color: white;
    border: 2px solid var(--color-success-dark);
    transition: all 0.2s ease-in-out;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

    transition: all 0.2s ease-in-out;

    &:hover {
      background: var(--color-primary);
      border-color: var(--color-primary);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(19, 115, 51, 0.18);
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
    &:disabled {
    background: rgba(220, 38, 38, 0.08);
    border: 2px solid rgba(220, 38, 38, 0.35);
    color: rgba(248, 113, 113, 0.7);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    }
  }
`;

const puedeCancelarTurno = (fechaHora) => {
  const fechaTurno = new Date(fechaHora);
  const ahora = new Date();

  const diferenciaMs = fechaTurno.getTime() - ahora.getTime();
  const unaHoraMs = 60 * 60 * 1000;

  return diferenciaMs >= unaHoraMs;
};

// --- 2. Componente Principal ---
export default function CardTurno({ turno, onCancelar, onAceptar, onReprogramar }) {
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [modalReprogramarAbierto, setModalReprogramarAbierto] = useState(false);
  const puedeCancelar = puedeCancelarTurno(turno.fechaHora);

  const confirmarReprogramacion = (turnoId, nuevoHorario) => {
    if (onReprogramar) {
      onReprogramar(turnoId, nuevoHorario);
    }
    setModalReprogramarAbierto(false);
  };

  const confirmarCancelacion = (motivo) => {
    if (onCancelar) onCancelar(turno.id, motivo);
    setModalCancelarAbierto(false);
  };

  const ultimoCambio = turno.historialEstado?.slice().reverse().find(h => h.estado === 'PENDIENTECAMBIO');
  const medicoIdStr = turno.medico?.id?.toString() || turno.medico?._id?.toString();
  const propuestoPorMedico = ultimoCambio?.usuario?.toString() === medicoIdStr;

  return (
    <>
      <TurnoCardLayout turno={turno}>
        <TurnoFooter>
          <CoberturaLabel>
            {'Turno '}
            {turno.estado === "PENDIENTECAMBIO" ? "pendiente de revision" : turno.estado.toLowerCase()}
          </CoberturaLabel>

          <TurnoActions>
            {turno.estado === "PENDIENTECAMBIO" ? (
              propuestoPorMedico ? (
                <BtnSecundario
                  variant="contained"
                  onClick={() => { if (onAceptar) onAceptar(turno.id); }}
                >
                  Aceptar cambio
                </BtnSecundario>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', marginRight: '8px', alignSelf: 'center' }}>
                  Esperando confirmación...
                </span>
              )
            ) : (
              <BtnSecundario
                  variant="contained"
                  onClick={() => setModalReprogramarAbierto(true)}
              >
                  Cambiar fecha
              </BtnSecundario>
            )}

            {puedeCancelar ? (
              <BtnCancelar
                variant="contained"
                onClick={() => setModalCancelarAbierto(true)}
              >
                Cancelar
              </BtnCancelar>
            ) : (
              <Tooltip
                title="No se puede cancelar un turno con menos de 1 hora de anticipación."
                arrow
              >
                <span>
                  <BtnCancelar variant="contained" disabled>
                    Cancelar
                  </BtnCancelar>
                </span>
              </Tooltip>
            )}
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