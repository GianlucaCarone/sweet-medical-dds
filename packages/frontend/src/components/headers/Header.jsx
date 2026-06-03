import "./Header.css";
import Navbar from "./Navbar.jsx";
import { Link } from "react-router-dom";
import MenuUsuario from "./MenuUsuario.jsx";
import CampanitaNotificacion from "./CampanitaNotification.jsx";

const Header = ({ userName }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <img
              src="logo.jpg"
              alt="Logo del Centro Médico"
              className="brand-logo"
            />
            <span className="brand-name">Sweet Medical</span>
          </Link>
        </div>

        <Navbar />

        <div className="header-actions">
          <CampanitaNotificacion />
          <MenuUsuario userName={userName} />
        </div>
        {/* <div className="navbar-actions">
          <div className="user-info">
            <img
              src="/ruta-avatar-usuario.png"
              alt="Avatar del usuario"
              className="user-avatar"
            />
            <span className="user-name" id="userName">
              {props.userName}
            </span>
          </div>

          <button type="button" className="btn-logout">
            Cerrar Sesión
          </button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
