import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAuth } from "../../context/AuthContext.jsx";

const pasos = ["Cuenta", "Datos Personales"];

/**
 * Modal de registro para nuevos Pacientes.
 * Props:
 *   - open: boolean
 *   - onClose: () => void
 *   - onRegistroSuccess: (usuario) => void
 *   - onIrALogin: () => void  (para el link "Ya tengo cuenta")
 */
export default function ModalRegistro({ open, onClose, onRegistroSuccess, onIrALogin }) {
  const { registro } = useAuth();

  const [paso, setPaso] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Campos del formulario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");

  const limpiarFormulario = () => {
    setPaso(0);
    setError("");
    setNombreUsuario("");
    setPassword("");
    setConfirmarPassword("");
    setNombre("");
    setDni("");
  };

  const handleCerrar = () => {
    limpiarFormulario();
    onClose();
  };

  const validarPaso0 = () => {
    if (!nombreUsuario.trim()) return "El nombre de usuario es requerido.";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmarPassword) return "Las contraseñas no coinciden.";
    return null;
  };

  const validarPaso1 = () => {
    if (!nombre.trim()) return "El nombre completo es requerido.";
    const dniNum = Number(dni);
    if (!dni || isNaN(dniNum) || dniNum < 1000000) return "El DNI debe ser un número válido.";
    return null;
  };

  const handleSiguiente = () => {
    const errorValidacion = validarPaso0();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setError("");
    setPaso(1);
  };

  const handleVolver = () => {
    setError("");
    setPaso(0);
  };

  const handleRegistrar = async () => {
    const errorValidacion = validarPaso1();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setError("");
    try {
      setLoading(true);
      const usuario = await registro({
        nombreUsuario: nombreUsuario.trim(),
        password,
        nombre: nombre.trim(),
        dni: Number(dni),
      });
      limpiarFormulario();
      onRegistroSuccess(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleCerrar} fullWidth maxWidth="xs">
      <DialogTitle align="center" sx={{ pb: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <PersonAddAltIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h6" fontWeight="bold">
            Crear cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registrate como Paciente en Sweet Medical
          </Typography>
        </Box>
      </DialogTitle>

      <Box sx={{ px: 3, pt: 2 }}>
        <Stepper activeStep={paso} alternativeLabel>
          {pasos.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Paso 0: Datos de cuenta */}
        {paso === 0 && (
          <>
            <TextField
              id="registro-usuario"
              label="Nombre de usuario / Email"
              type="text"
              variant="outlined"
              fullWidth
              required
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              autoFocus
            />
            <TextField
              id="registro-password"
              label="Contraseña"
              type={mostrarPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarPassword((v) => !v)} edge="end">
                      {mostrarPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="registro-confirmar-password"
              label="Confirmar contraseña"
              type={mostrarPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
            />
          </>
        )}

        {/* Paso 1: Datos personales */}
        {paso === 1 && (
          <>
            <TextField
              id="registro-nombre"
              label="Nombre completo"
              type="text"
              variant="outlined"
              fullWidth
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
            <TextField
              id="registro-dni"
              label="DNI"
              type="number"
              variant="outlined"
              fullWidth
              required
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              inputProps={{ min: 1000000 }}
            />
          </>
        )}

        {/* Link a Login */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            ¿Ya tenés cuenta?{" "}
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: "none", p: 0, minWidth: 0 }}
              onClick={() => {
                limpiarFormulario();
                onIrALogin();
              }}
            >
              Iniciá sesión
            </Button>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        {paso === 0 ? (
          <Button onClick={handleCerrar} color="inherit" disabled={loading}>
            Cancelar
          </Button>
        ) : (
          <Button onClick={handleVolver} color="inherit" disabled={loading}>
            Volver
          </Button>
        )}

        {paso === 0 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSiguiente}
            disabled={loading}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            id="btn-confirmar-registro"
            variant="contained"
            color="primary"
            onClick={handleRegistrar}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Confirmar registro"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
