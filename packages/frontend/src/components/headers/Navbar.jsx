import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-menu">
      <ul className="nav-list">
        <li className="nav-item">
          <a href="/" className="nav-link active">
            Inicio
          </a>
        </li>
        <li className="nav-item">
          <a href="/buscador-turnos" className="nav-link">
            Reservar Turno
          </a>
        </li>
        <li className="nav-item">
          <a href="/mis-turnos" className="nav-link">
            Mis Turnos
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
