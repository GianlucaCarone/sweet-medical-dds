import "./Navbar.css";

const Navbar = () => {
  return (
    <nav class="navbar-menu">
      <ul class="nav-list">
        <li class="nav-item">
          <a href="/" class="nav-link active">
            Inicio
          </a>
        </li>
        <li class="nav-item">
          <a href="/" class="nav-link">
            Reservar Turno
          </a>
        </li>
        <li class="nav-item">
          <a href="/" class="nav-link">
            Mis Turnos
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
