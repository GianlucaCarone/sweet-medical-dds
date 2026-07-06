import { useState } from "react";
import CardTurnoReprogramar from "../cards/CardTurno/CardTurnoReprogramar.jsx"
import "./ReprogramarTurnoModal.css";

export default function ReprogramarTurnoModal({
    abierto,
    turno,
    onCerrar,
    onConfirmar,
}) {
    const [nuevaFechaHoraPropuesta, setNuevaFechaHoraPropuesta] = useState("");

    if (!abierto) return null;

    const esFechaHoraValida = (fechaHora) => {
        if (!fechaHora) return false;

        const fechaHoraSeleccionada = new Date(fechaHora);
        const ahora = new Date();

        return fechaHoraSeleccionada.getTime() > ahora.getTime();
    };

    const obtenerFechaMinimaLocal = () => {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const puedeConfirmar = esFechaHoraValida(nuevaFechaHoraPropuesta);

    const confirmarCambio = () => {
        if (!esFechaHoraValida(nuevaFechaHoraPropuesta)) return;

        onConfirmar(turno.id, nuevaFechaHoraPropuesta);
        setNuevaFechaHoraPropuesta("");
        onCerrar();
    };

    return (
        <div className="modal-overlay">
            <div className="reprogramar-modal">
                <div className="reprogramar-header">
                    <div>
                        <h2>Cambiar fecha</h2>
                        <p>Elegí la nueva fecha y horario para este turno.</p>
                    </div>

                    <button className="modal-close-btn" onClick={onCerrar}>
                        ×
                     </button>
                </div>

                <CardTurnoReprogramar turno={turno}></CardTurnoReprogramar>

                <h4>Nuevo horario</h4>

                <div className="nuevo-horario-form">
                    <input
                        type="datetime-local"
                        className="form-control form-control-sm mb-2"
                        value={nuevaFechaHoraPropuesta}
                        onChange={e => setNuevaFechaHoraPropuesta(e.target.value)}
                        min={obtenerFechaMinimaLocal()}
                        required
                        style={{ fontSize: '12px' }}
                    />
                </div>

                {(nuevaFechaHoraPropuesta && !esFechaHoraValida(nuevaFechaHoraPropuesta)) && <p className="reprogramar-error">Ingrese una fecha válida</p>}

                <div className="modal-actions">
                    <button className="btn-no-cancelar" onClick={onCerrar}>
                        Volver
                    </button>

                    <button
                        className="btn-confirmar-reprogramacion"
                        disabled={!puedeConfirmar}
                        onClick={confirmarCambio}
                    >
                        Confirmar cambio
                    </button>
                </div>
            </div>
        </div>
    );
}