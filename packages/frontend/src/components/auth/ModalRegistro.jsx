import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAuth } from "../../context/AuthContext.jsx";
import { getObrasSociales } from "../../api/obraSocialApi.js";

const pasos = ["Cuenta", "Datos Personales", "Cobertura (Opcional)"];

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

  // Paso 0 — Cuenta
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Paso 1 — Datos personales
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");

  // Paso 2 — Cobertura (opcional)
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loadingObras, setLoadingObras] = useState(false);
  const [obraSocialSeleccionada, setObraSocialSeleccionada] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState(""); // ObjectId del subdocumento plan

  // Carga las obras sociales (con sus planes incluidos) al llegar al paso 2
  useEffect(() => {
    if (paso === 2 && obrasSociales.length === 0) {
      setLoadingObras(true);
      getObrasSociales()
        .then((data) => setObrasSociales(data))
        .catch(() => setError("No se pudieron cargar las obras sociales."))
        .finally(() => setLoadingObras(false));
    }
  }, [paso, obrasSociales.length]);

  const limpiarFormulario = () => {
    setPaso(0);
    setError("");
    setNombreUsuario("");
    setPassword("");
    setConfirmarPassword("");
    setNombre("");
    setDni("");
    setObraSocialSeleccionada("");
    setPlanSeleccionado("");
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
    const validadores = [validarPaso0, validarPaso1];
    const err = validadores[paso]?.();
    if (err) { setError(err); return; }
    setError("");
    setPaso((prev) => prev + 1);
  };

  const handleVolver = () => {
    setError("");
    setPaso((prev) => prev - 1);
  };

  /**
   * Ejecuta el registro, incluyendo la cobertura si fue seleccionada.
   * Si no se seleccionó obra social, registra sin cobertura (estado válido del negocio).
   */
  const handleRegistrar = async () => {
    setError("");
    try {
      setLoading(true);

      const payload = {
        nombreUsuario: nombreUsuario.trim(),
        password,
        nombre: nombre.trim(),
        dni: Number(dni),
      };

      // Solo incluye cobertura si el usuario seleccionó algo
      if (obraSocialSeleccionada) {
        payload.obraSocial = obraSocialSeleccionada;
        if (planSeleccionado) {
          // Se envía el id del plan del DTO (= ObjectId del subdocumento)
          payload.plan = planSeleccionado;
        }
      }

      const usuario = await registro(payload);
      limpiarFormulario();
      onRegistroSuccess(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Planes del select: se derivan de la obra social ya cargada (1 solo request)
  // El DTO de ObraSocial usa "id" (no "_id")
  const obraSocialActual = obrasSociales.find((os) => os.id === obraSocialSeleccionada);
  const planesDisponibles = obraSocialActual?.planes ?? [];

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

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2, minHeight: "220px" }}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* ── Paso 0: Datos de cuenta ── */}
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
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setMostrarPassword((v) => !v)}
                      edge="end"
                    >
                      {mostrarPassword ? <VisibilityOff /> : <Visibility />}
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

        {/* ── Paso 1: Datos personales ── */}
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

        {/* ── Paso 2: Cobertura médica (Opcional) ── */}
        {paso === 2 && (
          <Box display="flex" flexDirection="column" gap={2}>
            {loadingObras ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="select-obra-social-label">Obra Social (Opcional)</InputLabel>
                  <Select
                    labelId="select-obra-social-label"
                    id="select-obra-social"
                    value={obraSocialSeleccionada}
                    label="Obra Social (Opcional)"
                    onChange={(e) => {
                      setObraSocialSeleccionada(e.target.value);
                      setPlanSeleccionado(""); // resetear plan al cambiar OS
                    }}
                  >
                    <MenuItem value=""><em>Ninguna</em></MenuItem>
                    {obrasSociales.map((os) => (
                      // El DTO devuelve "id" (no "_id")
                      <MenuItem key={os.id} value={os.id}>
                        {os.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" disabled={!obraSocialSeleccionada}>
                  <InputLabel id="select-plan-label">Plan (Opcional)</InputLabel>
                  <Select
                    labelId="select-plan-label"
                    id="select-plan"
                    value={planSeleccionado}
                    label="Plan (Opcional)"
                    onChange={(e) => setPlanSeleccionado(e.target.value)}
                  >
                    <MenuItem value=""><em>Ningún plan</em></MenuItem>
                    {planesDisponibles.map((plan) => (
                      // El DTO devuelve "id" (no "_id") para los planes
                      <MenuItem key={plan.id} value={plan.id}>
                        {plan.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Cargar tu obra social permite calcular el costo de tus turnos automáticamente.
                  Podés hacerlo luego desde <strong>Mi Perfil</strong>.
                </Typography>
              </>
            )}
          </Box>
        )}

        {/* Link a Login (solo en los primeros 2 pasos) */}
        {paso < 2 && (
          <Box textAlign="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tenés cuenta?{" "}
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: "none", p: 0, minWidth: 0 }}
                onClick={() => { limpiarFormulario(); onIrALogin(); }}
              >
                Iniciá sesión
              </Button>
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        {/* Botón izquierdo */}
        {paso === 0 ? (
          <Button onClick={handleCerrar} color="inherit" disabled={loading}>
            Cancelar
          </Button>
        ) : (
          <Button onClick={handleVolver} color="inherit" disabled={loading}>
            Volver
          </Button>
        )}

        {/* Botón(es) derecho(s) */}
        <Box>
          {paso < 2 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSiguiente}
              disabled={loading}
            >
              Siguiente
            </Button>
          ) : (
            // Un solo botón: registra con la cobertura seleccionada (o sin ella si no eligió)
            <Button
              id="btn-confirmar-registro"
              variant="contained"
              color="primary"
              onClick={handleRegistrar}
              disabled={loading || loadingObras}
            >
              {loading ? "Registrando..." : "Registrarme"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
