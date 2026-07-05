import { useNavigate } from "react-router-dom";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import "./ErrorPage.css";

export default function ErrorPage({
  codigo = "404",
  titulo = "Página no encontrada",
  descripcion = "La página que intentás visitar no existe o fue movida.",
}) {
  const navigate = useNavigate();

  const iconos = {
    "404": <SearchOffRoundedIcon />,
    "403": <LockRoundedIcon />,
    "500": <ErrorOutlineRoundedIcon />,
  };

  return (
    <section className="error-page">
      <div className="error-card">
        <div className="error-icon">
            {iconos[codigo]}
        </div>

        <span className="error-code">{codigo}</span>

        <h1>{titulo}</h1>

        <p>{descripcion}</p>

        <div className="error-actions">
          <button className="btn-volver" onClick={() => navigate("/")}>
            Volver al inicio
          </button>

          <button className="btn-atras" onClick={() => navigate(-1)}>
            Página anterior
          </button>
        </div>
      </div>
    </section>
  );
}