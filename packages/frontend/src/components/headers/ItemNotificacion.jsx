import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from "@mui/material";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";

export default function ItemNotificacion({
  notificacion,
  onMarcarLeida,
  onMarcarNoLeida,
  pantallaCompleta = false
}) {
  const { id, mensaje, remitente, fechaHoraCreacion, leida, fechaHoraLeida } = notificacion;
  const [openModal, setOpenModal] = useState(false);

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

  const handleToggleEstado = async () => {
    if (!leida) {
      await onMarcarLeida(id);
    } else {
      await onMarcarNoLeida(id);
    }
    setOpenModal(false);
  };

  return (
    <>
      <ListItem
        sx={{
          p: pantallaCompleta ? 2.5 : 2,
          borderRadius: "8px",
          mb: pantallaCompleta ? 1.5 : 0.5,
          bgcolor: !leida && pantallaCompleta ? "action.hover" : "transparent",
          border: pantallaCompleta ? "1px solid" : "none",
          borderColor: !leida && pantallaCompleta ? "action.selected" : "divider",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: pantallaCompleta ? "0px 4px 12px rgba(0, 0, 0, 0.04)" : "none",
            bgcolor: !leida && pantallaCompleta ? "action.selected" : "action.hover"
          },
          pr: pantallaCompleta ? 8 : 7,
          position: "relative"
        }}
      >
        <ListItemText
          primary={
            <Box>
              <Typography
                variant="body2"
                fontWeight={!leida ? "600" : "400"}
                color="text.primary"
                sx={{
                  wordBreak: "break-word",
                  fontSize: pantallaCompleta ? "15px" : "14px",
                  // Truncado condicional si el mensaje es muy largo (2 líneas de tope)
                  display: mensaje && mensaje.length > 60 ? "-webkit-box" : "block",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: mensaje && mensaje.length > 60 ? 'hidden' : 'visible',
                  textOverflow: mensaje && mensaje.length > 60 ? 'ellipsis' : 'clip',
                  whiteSpace: 'normal'
                }}
              >
                {mensaje}
              </Typography>
              {/* Enlace accesible "Ver más" únicamente si el mensaje es largo */}
              {mensaje && mensaje.length > 60 && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    color="primary"
                    onClick={() => setOpenModal(true)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      display: "inline-block",
                      "&:hover": { color: "primary.dark" }
                    }}
                  >
                    Ver más
                  </Typography>
                </Box>
              )}
            </Box>
          }
          secondary={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.8,
                gap: 1,
                width: "100%"
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: pantallaCompleta ? "65%" : "55%",
                  fontSize: "12px"
                }}
                title={`De: ${remitente}`}
              >
                De: <strong>{remitente}</strong>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: "12px"
                }}
              >
                {formatearFecha(fechaHoraCreacion)}
              </Typography>
            </Box>
          }
        />

        {!leida ? (
          <Tooltip title="Marcar como leída">
            <IconButton
              edge="end"
              size="small"
              onClick={() => onMarcarLeida(id)}
              sx={{
                position: "absolute",
                right: pantallaCompleta ? 20 : 16,
                top: pantallaCompleta ? "22px" : "18px", // Posición vertical fija respecto a la cabecera
                color: "success.main",
                bgcolor: "success.light",
                opacity: 0.85,
                "&:hover": { bgcolor: "success.light", opacity: 1 },
              }}
            >
              <MarkAsUnreadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Marcar como no leída">
            <IconButton
              edge="end"
              size="small"
              onClick={() => onMarcarNoLeida(id)}
              sx={{
                position: "absolute",
                right: pantallaCompleta ? 20 : 16,
                top: pantallaCompleta ? "22px" : "18px", // Posición vertical fija respecto a la cabecera
                color: "text.secondary",
                bgcolor: "action.disabledBackground",
                "&:hover": { bgcolor: "action.focus" },
              }}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </ListItem>

      {/* Modal de Detalle Estético y Accesible */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              p: 1.5
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "primary.main",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1
          }}
        >
          Detalle de Notificación
          <IconButton onClick={() => setOpenModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3.5 }}>
          {/* Mensaje Completo */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: "500",
              lineHeight: 1.6,
              color: "text.primary",
              mb: 3,
              fontSize: "16px",
              wordBreak: "break-word"
            }}
          >
            {mensaje}
          </Typography>

          {/* Caja de Metadatos */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.8,
              p: 2,
              borderRadius: "8px",
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider"
            }}
          >
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Remitente: <strong>{remitente}</strong>
              </Typography>
              <Chip
                label={leida ? "Leída" : "Sin leer"}
                color={leida ? "success" : "info"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography variant="caption" color="text.secondary">
                Enviado: {formatearFecha(fechaHoraCreacion)}
              </Typography>
              {leida && fechaHoraLeida && (
                <Typography variant="caption" color="text.secondary">
                  Leído: {formatearFecha(fechaHoraLeida)}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleToggleEstado}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
          >
            {leida ? "Marcar como no leída" : "Marcar como leída"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(false)}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
