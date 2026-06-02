import "./Header.css";
import Navbar from "./Navbar.jsx";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <header class="header">
      <div class="header-container">
        <div class="header-brand">
          <Link to="/" class="brand-link">
            <img
              src="logo.jpg"
              alt="Logo del Centro Médico"
              class="brand-logo"
            />
            <span class="brand-name">Sweet Medical</span>
          </Link>
        </div>

        <Navbar />

        <div class="navbar-actions">
          <div class="user-info">
            <img
              src="/ruta-avatar-usuario.png"
              alt="Avatar del usuario"
              class="user-avatar"
            />
            <span class="user-name" id="userName">
              {props.userName}
            </span>
          </div>

          <button type="button" class="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
