import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useThemeContext } from "../../context/ThemeContext";
import "./HamburgerMenu.css";

const HamburgerMenu = ({ onAbrirLogin, onAbrirRegistro }) => {
  const [open, setOpen] = useState(false);
  const [cantUnidades, setCantUnidades] = useState(0);
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const { counterCarrito, manejoCarritoDrawer } = useCart();
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);

  const handleToggle = () => setOpen((prev) => !prev);

  const irA = (path) => {
    navigate(path);
    handleClose();
  };

  const handleCartClick = () => {
    handleClose();
    manejoCarritoDrawer.abrir();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  useEffect(() => {
    setCantUnidades(counterCarrito);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleToggle}
        className="hamburger-btn"
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        className="hamburger-drawer"
      >
        <Box className="hamburger-content">
          <Box className="hamburger-header">
            <Typography variant="h6" fontWeight="bold">
              Sweet Medical
            </Typography>
            <IconButton onClick={handleClose} aria-label="Cerrar menú">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {user && (
            <Box className="hamburger-user">
              <Avatar>
                {user.nombreUsuario?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.nombreUsuario || "Usuario"}
              </Typography>
            </Box>
          )}

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => irA("/")}>
                <ListItemIcon>
                  <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
              </ListItemButton>
            </ListItem>

            {!user && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => irA("/busqueda-turnos")}>
                  <ListItemIcon>
                    <CalendarMonthRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Buscar Turnos" />
                </ListItemButton>
              </ListItem>
            )}

            {user?.rol === "PACIENTE" && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => irA("/busqueda-turnos")}>
                  <ListItemIcon>
                    <CalendarMonthRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reservar Turno" />
                </ListItemButton>
              </ListItem>
            )}

            {user?.rol === "MEDICO" && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => irA("/mi-agenda")}>
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mi Agenda" />
                </ListItemButton>
              </ListItem>
            )}

            {user?.rol === "PACIENTE" && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => irA("/mis-turnos")}>
                  <ListItemIcon>
                    <FormatListBulletedRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mis Turnos" />
                </ListItemButton>
              </ListItem>
            )}

            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={mode === "light" ? "Modo Oscuro" : "Modo Claro"}
                />
              </ListItemButton>
            </ListItem>

            {user?.rol !== 'MEDICO' ? <ListItem disablePadding>
              <ListItemButton onClick={handleCartClick}>
                <ListItemIcon>
                  <Badge badgeContent={cantUnidades} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Carrito" />
              </ListItemButton>
            </ListItem> : <></>}

            <Divider />

            {user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => irA("/mis-notificaciones")}>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={() => irA("/mi-perfil")}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mi Perfil" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" sx={{ color: "error.main" }} />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onAbrirRegistro();
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registrarse" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onAbrirLogin();
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Iniciar Sesión" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
