import { Card } from "@mui/material"
import BadgeEstado from "../BadgeEstado";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import "./MedicoCard.css"

export default function MedicoCard({ turno, especialidades = {}, practicas = {} }) {
    
    const formatoServicio = (servicio = {}) => {
      if (servicio?.tipo === "especialidad") {
        return `${servicio?.nombre} • Consulta general`;
      } else {
        const practica = practicas?.find((p) => p.id === servicio.id);
        return `${especialidades?.find((e) => e.id === practica.especialidadPadre)?.nombre} • ${practica.nombre}`;
      }
    };

    return (
        <>
            <div className="info-principal">
                <div className="info-medico">
                    <div className="avatar-placeholder">
                        <PersonIcon fontSize="24px" />
                    </div>

                    <div className="datos-turno">
                        <h4>{turno.medico.nombre}</h4>

                        <p className="especialidad-practica">
                        <MedicalServicesIcon fontSize="15px" />
                        {formatoServicio(turno.servicio)}
                        </p>

                        <p className="sede">
                        <LocationPinIcon fontSize="15px" />
                        {turno.sede.nombre}
                        </p>
                    </div>
                </div>

                <div className="info-lateral">
                    <BadgeEstado status={ turno.estadoCobertura }/>

                    <span className="costo-turno">
                        {turno.costo !== 0
                        ? `$${turno.costo.toLocaleString()} `
                        : "Sin costo"}
                    </span>
                </div>
            </div>
        </>
    )
}