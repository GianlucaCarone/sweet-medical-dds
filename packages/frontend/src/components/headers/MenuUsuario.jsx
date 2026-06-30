import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuUsuario.css";
import { useAuth } from "../../context/AuthContext";

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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function MenuUsuario({ userName = "Usuario", onLogoutSuccess }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    onLogoutSuccess();
    navigate("/");
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
            className: "menu-paper-custom",
          },
        }}
      >
        {/* "Mi Perfil" navega a /mi-perfil (PACIENTE) */}
        {user?.rol === "PACIENTE" && (
          <MenuItem onClick={() => { navigate("/mi-perfil"); handleMenuClose(); }}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Mi Perfil
          </MenuItem>
        )}

        {/* "Perfil Médico" solo visible para usuarios con rol MEDICO */}
        {user?.rol === "MEDICO" && (
          <MenuItem onClick={() => { navigate("/perfil-medico"); handleMenuClose(); }}>
            <ListItemIcon>
              <MedicalServicesIcon fontSize="small" />
            </ListItemIcon>
            Perfil Médico
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
