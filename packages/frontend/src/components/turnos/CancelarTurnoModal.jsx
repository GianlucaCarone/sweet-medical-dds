import { useState } from "react";
import "./CancelarTurnoModal.css";

export default function CancelarTurnoModal({ abierto, onCerrar, onConfirmar }) {
    const [motivo, setMotivo] = useState("");

    if (!abierto) return null;

    const confirmarCancelacion = () => {
        if (!motivo.trim()) {
            return;
        }

        onConfirmar(motivo);
        setMotivo("");
        onCerrar();
    };

    return (
        <div className="modal-overlay">
            <div className="cancelar-modal">
                <h2>Cancelar turno</h2>

                <p>
                    ¿Estás seguro de que querés cancelar este turno? Para continuar,
                    indicá el motivo de la cancelación.
                </p>

                <label>Motivo</label>

                <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej: No puedo asistir en ese horario"
                />

                <div className="modal-actions">
                    <button className="btn-no-cancelar" onClick={onCerrar}>
                        No cancelar
                    </button>

                    <button
                        className="btn-confirmar-cancelacion"
                        onClick={confirmarCancelacion}
                        disabled={!motivo.trim()}
                    >
                        Confirmar cancelación
                    </button>
                </div>
            </div>
        </div>
    );
}