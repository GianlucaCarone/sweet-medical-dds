import { useState } from "react";
import { Avatar } from '@mui/material';
import CardTurnoReprogramar from "../cards/CardTurno/CardTurnoReprogramar.jsx"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { useAlert } from "../../context/AlertContext.jsx";
import "./ReprogramarTurnoModal.css";

export default function ReprogramarTurnoModal({
    abierto,
    turno,
    onCerrar,
    onConfirmar,
}) {
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [nuevaHora, setNuevaHora] = useState("");
    const [enviando, setEnviando] = useState(false);

    if (!abierto) return null;

    const esFechaHoraValida = (fecha, hora) => {
        if (!fecha || !hora) return false;

        const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
        const ahora = new Date();

        return fechaHoraSeleccionada.getTime() > ahora.getTime();
    };

    const puedeConfirmar = esFechaHoraValida(nuevaFecha, nuevaHora) && !enviando;

    const confirmarCambio = async () => {
        if (!esFechaHoraValida(nuevaFecha, nuevaHora)) return;

        const nuevoHorario = { fecha: nuevaFecha, hora: nuevaHora };

        setEnviando(true);

        try {
            //await reprogramarTurno(turno.id, nuevoHorario);
            onConfirmar(turno.id, nuevoHorario);
            setNuevaFecha("");
            setNuevaHora("");
            onCerrar();
        } catch (err) {
            useAlert(err.message, "error");
        } finally {
            setEnviando(false);
        }
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
                    <label className="campo-horario">
                        <span>
                            <CalendarMonthRoundedIcon fontSize="small" /> Fecha
                        </span>
                        <input
                            type="date"
                            value={nuevaFecha}
                            onChange={(e) => setNuevaFecha(e.target.value)}
                        />
                    </label>

                    <label className="campo-horario">
                        <span>Hora</span>
                        <input
                            type="time"
                            value={nuevaHora}
                            onChange={(e) => setNuevaHora(e.target.value)}
                        />
                    </label>
                </div>

                {(nuevaFecha || nuevaHora && !esFechaHoraValida(nuevaFecha, nuevaHora)) && <p className="reprogramar-error">Ingrese una fecha válida</p>}

                <div className="modal-actions">
                    <button className="btn-no-cancelar" onClick={onCerrar}>
                        Volver
                    </button>

                    <button
                        className="btn-confirmar-reprogramacion"
                        disabled={!puedeConfirmar}
                        onClick={confirmarCambio}
                    >
                        {enviando ? "Guardando..." : "Confirmar cambio"}
                    </button>
                </div>
            </div>
        </div>
    );
}