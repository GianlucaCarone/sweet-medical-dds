import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from '@mui/icons-material/Undo';
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { useNotificaciones } from "../../context/NotificacionContext";
import { useNavigate } from "react-router-dom";

export default function CampanitaNotification() {
  const navigate = useNavigate();
  const {
    notificacionesLeidas,
    notificacionesNoLeidas,
    cargando,
    cantidadNoLeidas,
    cantidadLeidas,
    hasMoreNoLeidas,
    hasMoreLeidas,
    marcarComoLeida,
    marcarComoNoLeida,
    marcarTodasComoLeidas,
    cargarMasNoLeidas,
    cargarMasLeidas
  } = useNotificaciones();

  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-describedby={id}
          className="notification-btn"
          sx={{ color: 'primary.main' }}
        >
          <Badge color="error" variant="dot" invisible={cantidadNoLeidas === 0}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 500,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Notificaciones
          </Typography>
          {cantidadNoLeidas > 0 && (
            <Button
              size="small"
              onClick={marcarTodasComoLeidas}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Marcar todo leído
            </Button>
          )}
        </Box>

        {/* Pestañas */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="notificaciones tabs"
          >
            <Tab
              label={`Sin leer (${cantidadNoLeidas})`}
              id="tab-no-leidas"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            />
            <Tab
              label={`Leídas (${cantidadLeidas})`}
              id="tab-leidas"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            />
          </Tabs>
        </Box>

        {/* Contenido / Listado */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 180, display: 'flex', flexDirection: 'column', width: '100%' }}>
          {cargando && (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!cargando && tabValue === 0 && (
            <>
              {notificacionesNoLeidas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    p: 4,
                    textAlign: "center",
                    width: "100%",
                    minHeight: 180
                  }}
                >
                  <NotificationsOffIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.6 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No tienes notificaciones pendientes.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {notificacionesNoLeidas.map((n, index) => (
                    <React.Fragment key={n.id || index}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          bgcolor: 'action.hover',
                          transition: 'background-color 0.2s',
                          '&:hover': { bgcolor: 'action.selected' },
                          pr: 7, // Espacio para el botón de acción
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="600" color="text.primary">
                              {n.mensaje}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                De: {n.remitente}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatearFecha(n.fechaHoraCreacion)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Tooltip title="Marcar como leída">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => marcarComoLeida(n.id)}
                            sx={{
                              position: 'absolute',
                              right: 16,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'success.main',
                              bgcolor: 'success.light',
                              opacity: 0.8,
                              '&:hover': { bgcolor: 'success.light', opacity: 1 },
                            }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {index < notificacionesNoLeidas.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              {hasMoreNoLeidas && (
                <Box display="flex" justifyContent="center" p={1.5} borderTop={1} borderColor="divider">
                  <Button
                    size="small"
                    onClick={cargarMasNoLeidas}
                    disabled={cargando}
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                  >
                    {cargando ? "Cargando..." : "Cargar más"}
                  </Button>
                </Box>
              )}
            </>
          )}

          {!cargando && tabValue === 1 && (
            <>
              {notificacionesLeidas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    p: 4,
                    textAlign: "center",
                    width: "100%",
                    minHeight: 180
                  }}
                >
                  <NotificationsOffIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.6 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No tienes notificaciones leídas.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {notificacionesLeidas.map((n, index) => (
                    <React.Fragment key={n.id || index}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          opacity: 0.8,
                          transition: 'background-color 0.2s',
                          '&:hover': { bgcolor: 'action.hover' },
                          pr: 7,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.primary">
                              {n.mensaje}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                De: {n.remitente}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatearFecha(n.fechaHoraCreacion)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Tooltip title="Marcar como no leída">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => marcarComoNoLeida(n.id)}
                            sx={{
                              position: 'absolute',
                              right: 16,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'text.secondary',
                              bgcolor: 'action.disabledBackground',
                              '&:hover': { bgcolor: 'action.focus' },
                            }}
                          >
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {index < notificacionesLeidas.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              {hasMoreLeidas && (
                <Box display="flex" justifyContent="center" p={1.5} borderTop={1} borderColor="divider">
                  <Button
                    size="small"
                    onClick={cargarMasLeidas}
                    disabled={cargando}
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                  >
                    {cargando ? "Cargando..." : "Cargar más"}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Pie del Popover */}
        <Box
          sx={{
            p: 1.5,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
            bgcolor: "background.default"
          }}
        >
          <Button
            size="small"
            fullWidth
            onClick={() => {
              navigate("/mis-notificaciones");
              handleClose();
            }}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Ver todas las notificaciones
          </Button>
        </Box>
      </Popover>
    </>
  );
}
