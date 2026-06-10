import "./EstadisticaTurnoCard.css";
import CardGen from "../../shared/CardGen/CardGen";

export default function EstadisticaTurnoCard({ numero, texto, tipo, icono }) {
    return (
        <CardGen className={`stat-card ${tipo}`}>
            <div className="stat-top">
                <div className={`stat-icon ${tipo}`}>{icono}</div>
                <p>{texto}</p>
            </div>

            <span className={`stat-numero ${tipo}`}>{numero}</span>
        </CardGen>
    );
}