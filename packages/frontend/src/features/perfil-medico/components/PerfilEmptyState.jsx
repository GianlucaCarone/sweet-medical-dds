import React from 'react';
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import "./PerfilEmptyState.css";

export default function PerfilEmptyState({
    titulo,
    descripcion,
    textoBoton,
    onClick
}) {
    return (
        <div className="perfil-empty-state">
            <div className="empty-icon">
                <ErrorOutlineRoundedIcon />
            </div>

            <h3>{titulo}</h3>

            <p>{descripcion}</p>

            {textoBoton && onClick && (
                <button
                    className="empty-action-btn"
                    onClick={onClick}
                >
                    {textoBoton}
                </button>
            )}
        </div>
    );
}
