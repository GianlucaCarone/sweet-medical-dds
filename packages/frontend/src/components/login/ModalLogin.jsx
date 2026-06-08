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
} from "@mui/material";
import { useAuth } from "../../context/AuthContext.jsx"; // Importamos el hook del contexto de autenticación

// Le pasamos las props 'open' y 'onClose' tal como hiciste en ModalPerfil
// Agregamos 'onLoginSuccess' para actualizar el contexto/estado del Header al loguearse
export default function ModalLogin({ open, onClose, onLoginSuccess }) {
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Traemos la función del estado global

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const userData = await login(email, password); // Llamamos al backend mediante el Context
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
    setEmail("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle align="center">Iniciar Sesión</DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleCerrar} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
