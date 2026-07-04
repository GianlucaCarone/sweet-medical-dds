import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Collapse,
  Link,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from "../../context/AuthContext.jsx";
import { getMiPerfil, actualizarPaciente } from "../../api/pacienteApi.js";
import { getObrasSociales } from "../../api/obraSocialApi.js";

export default function MiPerfil() {
  const { user } = useAuth();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Obras sociales cargadas desde el backend (cada una ya incluye sus planes)
  const [obrasSociales, setObrasSociales] = useState([]);
  // Selección actual en modo edición
  const [obraSocialSeleccionada, setObraSocialSeleccionada] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState(""); // ObjectId del subdocumento plan

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Carga paralela: perfil del paciente + lista de obras sociales
        const [pac, obras] = await Promise.all([
          getMiPerfil(),
          getObrasSociales(),
        ]);

        setPaciente(pac);
        setObrasSociales(obras);

        // Inicializar selects con los valores actuales del paciente
        // El DTO usa "id" (no "_id") tanto en obraSocial como en plan
        if (pac.obraSocial?.id) setObraSocialSeleccionada(pac.obraSocial.id);
        if (pac.plan?.id) setPlanSeleccionado(pac.plan.id);
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError("Error al cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const handleGuardarCambios = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await actualizarPaciente(paciente.id, {
        obraSocial: obraSocialSeleccionada || null,
        plan: planSeleccionado || null,
      });

      // Actualizar estado local para reflejar los cambios sin recargar
      // El DTO de ObraSocial usa "id" (no "_id")
      const obraSocialDoc = obrasSociales.find((os) => os.id === obraSocialSeleccionada);
      const planDoc = obraSocialDoc?.planes?.find((p) => p.id === planSeleccionado);

      setPaciente((prev) => ({
        ...prev,
        obraSocial: obraSocialDoc
          ? { id: obraSocialDoc.id, nombre: obraSocialDoc.nombre }
          : null,
        plan: planDoc
          ? { id: planDoc.id, nombre: planDoc.nombre }
          : null,
      }));

      setSuccess("Perfil actualizado correctamente.");
      setModoEdicion(false);
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelarEdicion = () => {
    // Restaurar valores originales
    if (paciente?.obraSocial?.id) setObraSocialSeleccionada(paciente.obraSocial.id);
    else setObraSocialSeleccionada("");
    if (paciente?.plan?.id) setPlanSeleccionado(paciente.plan.id);
    else setPlanSeleccionado("");
    setModoEdicion(false);
    setError("");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!paciente) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error">No se encontraron los datos del paciente.</Alert>
      </Box>
    );
  }

  // Planes disponibles para la obra social actualmente seleccionada en el select
  // El DTO de ObraSocial usa "id" (no "_id")
  const obraSocialActual = obrasSociales.find((os) => os.id === obraSocialSeleccionada);
  const planesDisponibles = obraSocialActual?.planes ?? [];

  // Texto a mostrar cuando NO estamos en modo edición
  const textoCobertura = paciente.obraSocial
    ? `${paciente.obraSocial.nombre} — Plan: ${paciente.plan?.nombre ?? "Sin plan"}`
    : "No tiene obra social cargada";

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Mi Perfil
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* ── SECCIÓN 1: Avatar, Nombre y DNI ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar sx={{ width: 90, height: 90, fontSize: "2.5rem", bgcolor: "primary.main" }}>
          {paciente.nombre?.[0]?.toUpperCase() ?? "U"}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {paciente.nombre}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            DNI: {paciente.dni}
          </Typography>
        </Box>
      </Box>

      {/* ── SECCIÓN 2: Obra Social / Plan y Usuario ── */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        {/* Cobertura médica */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Cobertura médica
            </Typography>
            {!modoEdicion && (
              <Link
                component="button"
                underline="none"
                color="primary"
                sx={{ fontSize: "0.875rem" }}
                onClick={() => setModoEdicion(true)}
              >
                editar
              </Link>
            )}
          </Box>

          {modoEdicion ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="os-edit-label">Obra Social</InputLabel>
                <Select
                  labelId="os-edit-label"
                  id="os-edit-select"
                  value={obraSocialSeleccionada}
                  label="Obra Social"
                  onChange={(e) => {
                    setObraSocialSeleccionada(e.target.value);
                    setPlanSeleccionado(""); // resetear plan al cambiar OS
                  }}
                >
                  <MenuItem value=""><em>Ninguna</em></MenuItem>
                  {obrasSociales.map((os) => (
                    // El DTO de ObraSocial usa "id" (no "_id")
                    <MenuItem key={os.id} value={os.id}>{os.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" size="small" disabled={!obraSocialSeleccionada}>
                <InputLabel id="plan-edit-label">Plan</InputLabel>
                <Select
                  labelId="plan-edit-label"
                  id="plan-edit-select"
                  value={planSeleccionado}
                  label="Plan"
                  onChange={(e) => setPlanSeleccionado(e.target.value)}
                >
                  <MenuItem value=""><em>Ningún plan</em></MenuItem>
                  {planesDisponibles.map((plan) => (
                    // El DTO de Plan usa "id" (no "_id")
                    <MenuItem key={plan.id} value={plan.id}>{plan.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" variant="contained" color="primary" onClick={handleGuardarCambios} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button size="small" color="inherit" onClick={handleCancelarEdicion} disabled={saving}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">{textoCobertura}</Typography>
          )}
        </Grid>

        {/* Usuario */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Usuario / Email
          </Typography>
          <Typography variant="body1">{user?.nombreUsuario ?? "Desconocido"}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: "primary.main", borderWidth: 1, my: 3, opacity: 0.2 }} />

      {/* ── SECCIÓN 3: Cambiar Contraseña (UI, funcionalidad pendiente) ── */}
      <Box sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="subtitle1"
          onClick={() => setShowPassword((prev) => !prev)}
          underline="none"
          sx={{ fontWeight: "bold", color: "primary.main", display: "flex", alignItems: "center" }}
        >
          {showPassword ? "- ocultar opciones de contraseña" : "+ cambiar contraseña"}
        </Link>
      </Box>

      <Collapse in={showPassword}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Contraseña actual
            </Typography>
            <TextField fullWidth size="small" type="password" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                Nueva contraseña
              </Typography>
              <TextField fullWidth size="small" type="password" variant="outlined" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                Confirmar nueva contraseña
              </Typography>
              <TextField fullWidth size="small" type="password" variant="outlined" />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="primary">
              Actualizar Contraseña
            </Button>
            <Typography variant="caption" sx={{ ml: 2, color: "text.secondary" }}>
              (Funcionalidad en desarrollo)
            </Typography>
          </Grid>
        </Grid>
      </Collapse>
    </Box>
  );
}
