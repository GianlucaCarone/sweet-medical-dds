import "./EstadisticaTurnoCard.css";
import CardBase from "../../shared/CardBase/CardBase";

export default function EstadisticaTurnoCard({ numero, texto, tipo, icono }) {
    return (
        <CardBase className={`stat-card ${tipo}`}>
            <div className="stat-top">
                <div className={`stat-icon ${tipo}`}>{icono}</div>
                <p>{texto}</p>
            </div>

            <span className={`stat-numero ${tipo}`}>{numero}</span>
        </CardBase>
    );
}