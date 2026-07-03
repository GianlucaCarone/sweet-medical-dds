import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealingRoundedIcon from '@mui/icons-material/HealingRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BadgeIcon from '@mui/icons-material/Badge';
import EventIcon from '@mui/icons-material/Event';
import { Box, Typography, Stack, IconButton, Button, Divider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import './carritoTurnos.css';
import { useAlert } from "../../context/AlertContext.jsx";
import { useState } from 'react';
import { reservarTurnos } from '../../api/apiBusquedaTurnos.js';

const formatoFechaHora = (isoString) => {
  const fecha = new Date(isoString);
  const texto = fecha.toLocaleString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export default function CarritoTurnos({ items, onEliminar, onConfirmar, onCerrar }) {
  const pacienteID = "6a0b720ada9b7c8a035d96a9"; //por ahora; hasta tener el login
  const total = items.reduce((acc, item) => acc + item.costo, 0);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  return (
    <Box component="aside" sx={{ 
        width: 320,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
        }}>
      {/* Título */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <ShoppingCartIcon sx={{ color: '#475569', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
          Preselección de Turnos
        </Typography>
        <IconButton
          size="small"
          className="carrito-item-eliminar"
          onClick={() => onCerrar()}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Lista de items */}
      <Stack spacing={1.5} sx={{ 
        flex: 1,
        overflowY: 'auto',
        py: 1,
      }}>
        {items.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', mt: 4 }}>
            No hay turnos seleccionados.
          </Typography>
        )}
        {items.map((item, index) => (
          <Box key={index} className="carrito-item">
            <IconButton
              size="small"
              className="carrito-item-eliminar"
              onClick={() => onEliminar(index)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Stack direction="row" alignItems="center" spacing={0.75}>
              <BadgeIcon sx={{ fontSize: 16, color: '#475569' }} />
              <Typography fontWeight={700} fontSize={14}>{item.medico.nombre}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <HealingRoundedIcon sx={{ fontSize: 15, color: '#475569' }} />
              <Typography fontSize={13} sx={{ color: '#475569' }}>{item.servicio.nombre}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <EventIcon sx={{ fontSize: 15, color: '#475569' }} />
              <Typography fontSize={13} sx={{ color: '#475569' }}>{formatoFechaHora(item.fechaHora)}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <BusinessRoundedIcon sx={{ fontSize: 15, color: '#475569' }} />
              <Typography fontSize={13} sx={{ color: '#475569' }}>{item.sede.nombre}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <span className={`badge-cobertura ${item.estadoCobertura === 'TOTAL' ? 'cubierto' : item.estadoCobertura === 'PARCIAL' ? 'parcial' : 'no-cubierto'}`}>
                {item.estadoCobertura === 'TOTAL' ? 'Cubierto' : item.estadoCobertura === 'PARCIAL' ? 'Parcial' : 'No cubierto'}
              </span>
              <Typography fontWeight={700} fontSize={14}>
                {item.costo === 0 ? 'Sin cargo' : `$${item.costo.toLocaleString()}`}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Footer */}
      <Box className="carrito-footer">
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography fontWeight={600}>Total a pagar:</Typography>
          <Typography fontWeight={700}>${total.toLocaleString()}</Typography>
        </Stack>
        <Button
          fullWidth
          variant="contained"
          disabled={items.length === 0}
          startIcon={<CheckCircleIcon />}
          onClick={async () => {
            try {
              await reservarTurnos(items.map((t) => t.id), pacienteID);
              showAlert("Turnos reservados exitosamente", "success");
              onCerrar();
              onConfirmar();
              navigate("/mis-turnos");
            } catch (e) {
              showAlert(e.message, "error");
            }
          }}
          sx={{
            backgroundColor: '#1d4ed8',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#1e40af' },
            '&:disabled': { backgroundColor: '#cbd5e1', color: '#94a3b8' }
          }}
        >
          Confirmar Turnos
        </Button>
      </Box>
    </Box>
  );
}