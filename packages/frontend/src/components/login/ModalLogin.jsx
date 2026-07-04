import React, { useState } from "react";
// Importamos los componentes de MUI
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext.jsx"; // Importamos el hook del contexto de autenticación

// Le pasamos las props 'open' y 'onClose' tal como hiciste en ModalPerfil
// Agregamos 'onLoginSuccess' para actualizar el contexto/estado del Header al loguearse
export default function ModalLogin({ open, onClose, onLoginSuccess, onIrARegistro }) {
  // El backend identifica al usuario por 'nombreUsuario', pero visualmente
  // el campo se muestra como "Correo Electrónico" para el usuario final.
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { login } = useAuth(); // Traemos la función del estado global

  const handleSubmit = async () => {
    setError('');

    try {
      setLoading(true);
      const userData = await login(nombreUsuario, password);
      onLoginSuccess(userData); // Llamamos a la función de éxito del login
      onClose(); // Si fue exitoso, cerramos el modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    // Limpiamos los errores y los campos si el usuario cierra el modal sin loguearse
    setError("");
    setNombreUsuario('');
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle align="center">Iniciar Sesión</DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            Bienvenido a Sweet Medical. Ingresá tus credenciales para continuar.
          </Typography>

          {/* Mostrar error si falla el login */}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />

          <TextField
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
                    onClick={() => setMostrarPassword((prev) => !prev)}
                    edge="end"
                  >
                    {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <Box sx={{ px: 3, pb: 0, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ¿No tenés cuenta?{' '}
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
              onClick={() => {
                onClose();
                if (onIrARegistro) onIrARegistro();
              }}
            >
              Registrate
            </Button>
          </Typography>
        </Box>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleCerrar} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
