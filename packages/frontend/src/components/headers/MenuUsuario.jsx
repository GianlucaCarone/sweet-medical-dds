import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos react-router-dom
import "./MenuUsuario.css"; // Importamos nuestro nuevo CSS
import { useAuth } from "../../context/AuthContext"; // Importamos nuestro contexto

// Importaciones de Material UI agrupadas para mayor limpieza
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ModalPerfil from "./ModalPerfil";

export default function MenuUsuario({ userName = "Andino Franco", onLogoutSuccess }) {
  const navigate = useNavigate(); // Hook para navegar por las rutas
  const { logout } = useAuth(); // Traemos la función de deslogueo global

  // Estados
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  // Manejadores del Menú Desplegable
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Manejadores del Modal
  const handleOpenProfileModal = () => {
    setIsModalOpen(true);
    handleMenuClose();
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // Acción de Cerrar Sesión usando React Router
  const handleLogout = () => {
    handleMenuClose();   // 1. Cerramos el menú desplegable
    logout();            // 2. Borramos token y usuario del estado global
    onLogoutSuccess();   // 3. Le avisamos al Header que dispare el Snackbar
    navigate("/");       // 4. Redirigimos a la landing page (home)
  };

  return (
    <React.Fragment>
      <Box className="menu-user-container">
        <Tooltip title="Configuración de cuenta">
          <IconButton
            onClick={handleMenuClick}
            size="small"
            className="menu-user-btn"
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu}
            // el bloque es flexible para que puedas agregar más cosas al header sin que se rompa el diseño del menú desplegable
            display="flex"
          >
            <Avatar className="menu-user-avatar">
              {userName[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            className: "menu-paper-custom", // Aplicamos nuestra clase CSS en lugar del objeto sx
          },
        }}
      >
        <MenuItem onClick={handleOpenProfileModal}>
          <Avatar /> Mi Perfil
        </MenuItem>
        <MenuItem onClick={() => { navigate("/perfil-medico"); handleMenuClose(); }}>
          <Avatar /> Perfil Médico
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      <ModalPerfil
        open={isModalOpen}
        onClose={handleCloseModal}
        userName={userName}
      />
    </React.Fragment>
  );
}
