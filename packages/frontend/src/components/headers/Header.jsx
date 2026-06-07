import "./Header.css";
import Navbar from "./Navbar.jsx";
import { Link } from "react-router-dom";
import MenuUsuario from "./MenuUsuario.jsx";
import CampanitaNotificacion from "./CampanitaNotification.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Drawer from "@mui/material/Drawer";
import { useState, useEffect } from "react";
import CarritoTurnos from "../../features/busqueda-turnos/carritoTurnos.jsx";

const Header = ({ userName, carrito, eliminarDelCarrito }) => {
  const [cantUnidades, setCantUnidades] = useState(0);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const cantUnidadesEnCarrito = () => {
    let suma = 0;
    for (const producto of carrito) {
      suma += producto.unidades;
    }
    return suma;
  };

  useEffect(() => {
    setCantUnidades(cantUnidadesEnCarrito());
  }, [carrito]);

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
          <button className="cart" onClick={() => setCarritoAbierto(true)}>
            <ShoppingCartIcon color="white" />
            <span className="cart-count">{cantUnidades}</span>
          </button>
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
        <Drawer
          anchor="right"
          open={carritoAbierto}
          onClose={() => setCarritoAbierto(false)}
        >
          <CarritoTurnos
            items={carrito}
            onEliminar={eliminarDelCarrito}
            onCerrar={() => setCarritoAbierto(false)}
          />
        </Drawer>
      </div>
    </header>
  );
};

export default Header;
