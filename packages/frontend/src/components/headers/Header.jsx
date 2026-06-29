import "./Header.css";
import Navbar from "./Navbar.jsx";
import { Link } from "react-router-dom";
import MenuUsuario from "./MenuUsuario.jsx";
import CampanitaNotificacion from "./CampanitaNotification.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState, useEffect } from "react";
import CarritoTurnos from "./carritoTurnos.jsx";
import ModalLogin from "../login/ModalLogin.jsx";
import { useAuth } from "../../context/AuthContext.jsx"; // Importamos el hook del contexto de autenticación
import { useCart } from '../../context/CartContext.jsx';
import {
  Drawer,
  Alert,
  AlertTitle,
  Snackbar,
  Badge,
  IconButton,
  Button,
} from "@mui/material";

const Header = () => {
  const { user } = useAuth(); // Traemos al usuario logueado
  const { carrito, limpiarCarrito,  eliminarDelCarrito, manejoCarritoDrawer } = useCart();

  const [cantUnidades, setCantUnidades] = useState(0);
  //estado para controlar si el Pop-up de Login está abierto o cerrado
  const [loginAbierto, setLoginAbierto] = useState(false);

  // Estados para el Snackbar de bienvenida
  const [snackbarAbierto, setSnackbarAbierto] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");

  const cantUnidadesEnCarrito = () => {
    return carrito.length; //por ahora, cada turno es una unidad. Si en el futuro se permite agregar más de un turno a la vez, habría que cambiar esto.
  };

  const handleLoginExitoso = (usuario) => {
    setLoginAbierto(false);
    // 2. Seteamos el mensaje personalizado (asumiendo que tu usuario tiene un 'nombreUsuario')
    setMensajeSnackbar(
      `¡Bienvenido/a de nuevo, ${usuario.nombreUsuario || "usuario"}!`,
    );
    // 3. Disparamos el Snackbar
    setSnackbarAbierto(true);
  };
  const handleLogoutExitoso = () => {
    setMensajeSnackbar("Sesión cerrada correctamente.");
    setSnackbarAbierto(true);
  };

  const handleCerrarSnackbar = (event, reason) => {
    // Si el usuario hace click afuera, no lo cerramos abruptamente
    if (reason === "clickaway") {
      return;
    }
    setSnackbarAbierto(false);
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
          <IconButton
            onClick={() => manejoCarritoDrawer.abrir()}
            aria-label="carrito de turnos"
            sx={{ marginRight: 2 }} // Un poco de margen a la derecha
          >
            <Badge badgeContent={cantUnidades} color="error">
              {/* Le puse color 'inherit' asumiendo que el fondo de tu header es oscuro. 
                  Si es blanco, borrale el sx y usá color="primary" */}
              <ShoppingCartIcon sx={{ color: "primary" }} />
            </Badge>
          </IconButton>
          {/* 2. Renderizado Condicional: 
              Si tenemos 'user' en el contexto, mostramos el Menú. 
              Si es null/undefined, mostramos el botón que abre el pop-up */}
          {user ? (
            <MenuUsuario
              userName={user.nombreUsuario || "Usuario"}
              onLogoutSuccess={handleLogoutExitoso}
            />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setLoginAbierto(true)}
              sx={{
                textTransform: "none", // Evita que el texto se ponga todo en mayúsculas
                borderRadius: "20px", // Le da un borde más redondeado y amigable
                fontWeight: "bold",
              }}
            >
              Iniciar Sesión
            </Button>
          )}
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
        {/* --- DRAWER DEL CARRITO --- */}
        {
          <Drawer
            anchor="right"
            open={manejoCarritoDrawer.getCarritoAbierto()}
            onClose={() => manejoCarritoDrawer.cerrar()}
          >
            <CarritoTurnos
              items={carrito}
              onEliminar={eliminarDelCarrito}
              onConfirmar={limpiarCarrito}
              onCerrar={() => manejoCarritoDrawer.cerrar()}
            />
          </Drawer>
        }

        {/* ---Modal DE LOGIN --- */}
        <ModalLogin
          open={loginAbierto}
          onClose={() => setLoginAbierto(false)}
          onLoginSuccess={handleLoginExitoso}
        />

        {/* --- SNACKBAR DE ÉXITO --- */}
        {/* autoHideDuration={3000} significa que se cierra solo a los 3 segundos */}
        <Snackbar
          open={snackbarAbierto}
          autoHideDuration={3000}
          onClose={handleCerrarSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCerrarSnackbar}
            severity="success"
            sx={{ width: "100%" }}
            variant="filled"
          >
            {mensajeSnackbar}
          </Alert>
        </Snackbar>
      </div>
    </header>
  );
};

export default Header;
