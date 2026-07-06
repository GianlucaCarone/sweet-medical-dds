import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Stack,
  Chip
} from '@mui/material';
import { Edit, Save, Cancel } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";
import { getMiPerfil, actualizarPaciente } from "../../api/pacienteApi.js";
import { getMiPerfilMedico, updateMedico } from "../../api/medico.js";
import { getObrasSociales } from "../../api/obraSocialApi.js";
import { actualizarUsuario } from "../../api/usuarioApi.js";
import { handleApiError } from "../../utils/handleApiError";

import "../perfil-medico/PerfilMedico.css";

export default function MiPerfil() {
  const { user, actualizarUsuarioContexto } = useAuth();
  const { showAlert } = useAlert();

  const [perfil, setPerfil] = useState(null);
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de edición independientes por entidad
  const [isEditingPerfil, setIsEditingPerfil] = useState(false);
  const [isEditingUsuario, setIsEditingUsuario] = useState(false);

  const [formPerfil, setFormPerfil] = useState({ nombre: "", dni: "", honorario: 0 });
  const [formCobertura, setFormCobertura] = useState({ obraSocial: "", plan: "" });
  const [formUsuario, setFormUsuario] = useState({ nombreUsuario: "", password: "", confirmPassword: "" });

  const nombreRef = useRef(null);
  const usuarioRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (user?.rol === "PACIENTE") {
          const [pac, obras] = await Promise.all([
            getMiPerfil(),
            getObrasSociales(),
          ]);
          setPerfil(pac);
          setObrasSociales(obras);
          setFormPerfil({ nombre: pac.nombre || "", dni: pac.dni || "", honorario: 0 });
          setFormCobertura({ 
            obraSocial: pac.obraSocial?.id || pac.obraSocial || "", 
            plan: pac.plan?.id || pac.plan || "" 
          });
        } else if (user?.rol === "MEDICO") {
          const med = await getMiPerfilMedico();
          setPerfil(med);
          setFormPerfil({ nombre: med.nombre || "", dni: "", honorario: med.honorario || 0 });
        }
        setFormUsuario({ nombreUsuario: user?.nombreUsuario || "", password: "", confirmPassword: "" });
      } catch (err) {
        const fueManejado = handleApiError(err, navigate);
        if (!fueManejado) {
          console.error("Error al cargar el perfil:", err);
          showAlert("Error al cargar los datos del perfil.", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDatos();
    }
  }, [user, showAlert]);

  useEffect(() => {
    if (!loading && perfil) {
      mainRef.current?.focus();
    }
  }, [loading, perfil]);

  const handleCancelarPerfil = () => {
    setIsEditingPerfil(false);
    if (perfil) {
      setFormPerfil({
        nombre: perfil.nombre || "",
        dni: perfil.dni || "",
        honorario: perfil.honorario || 0
      });
      setFormCobertura({
        obraSocial: perfil.obraSocial?.id || perfil.obraSocial || "",
        plan: perfil.plan?.id || perfil.plan || ""
      });
    }
  };

  const handleEditarPerfil = () => {
    // Cerrar otra pestaña si está abierta
    handleCancelarUsuario();
    setIsEditingPerfil(true);
    setTimeout(() => nombreRef.current?.focus(), 100);
  };

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();

    if (!formPerfil.nombre.trim()) {
      showAlert("El nombre completo es requerido.", "error");
      return;
    }

    if (user.rol === "PACIENTE") {
      const dniNum = Number(formPerfil.dni);
      if (!formPerfil.dni || isNaN(dniNum) || dniNum < 1000000) {
        showAlert("El DNI debe ser un número válido mayor a 1.000.000.", "error");
        return;
      }
    }

    if (user.rol === "MEDICO" && Number(formPerfil.honorario) < 0) {
      showAlert("El honorario no puede ser negativo.", "error");
      return;
    }

    try {
      if (user.rol === "PACIENTE") {
        const payload = {
          nombre: formPerfil.nombre,
          dni: Number(formPerfil.dni),
          obraSocial: formCobertura.obraSocial || null,
          plan: formCobertura.plan || null
        };
        const updatedPaciente = await actualizarPaciente(perfil.id, payload);
        setPerfil(updatedPaciente);
      } else if (user.rol === "MEDICO") {
        const payload = {
          nombre: formPerfil.nombre,
          honorario: Number(formPerfil.honorario)
        };
        const updatedMedico = await updateMedico(payload);
        setPerfil(updatedMedico);
      }
      setIsEditingPerfil(false);
      showAlert("Datos del perfil actualizados correctamente.", "success");
    } catch (err) {
      const fueManejado = handleApiError(err, navigate);
      if (!fueManejado) {
        console.error("Error al guardar perfil:", err);
        showAlert(err.response?.data?.message || err.message || "Error al actualizar el perfil.", "error");
      }
    }
  };

  const handleCancelarUsuario = () => {
    setIsEditingUsuario(false);
    setFormUsuario({
      nombreUsuario: user?.nombreUsuario || "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleEditarUsuario = () => {
    // Cerrar otra pestaña si está abierta
    handleCancelarPerfil();
    setIsEditingUsuario(true);
    setTimeout(() => usuarioRef.current?.focus(), 100);
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();

    if (!formUsuario.nombreUsuario.trim()) {
      showAlert("El nombre de usuario (Email) es requerido.", "error");
      return;
    }

    if (formUsuario.password) {
      if (formUsuario.password.length < 8) {
        showAlert("La contraseña debe tener al menos 8 caracteres.", "error");
        return;
      }
      if (!/(?=.*[A-Z])/.test(formUsuario.password)) {
        showAlert("La contraseña debe contener al menos una letra mayúscula.", "error");
        return;
      }
      if (!/(?=.*[a-z])/.test(formUsuario.password)) {
        showAlert("La contraseña debe contener al menos una letra minúscula.", "error");
        return;
      }
      if (!/(?=.*\d)/.test(formUsuario.password)) {
        showAlert("La contraseña debe contener al menos un número.", "error");
        return;
      }
      if (formUsuario.password !== formUsuario.confirmPassword) {
        showAlert("Las contraseñas no coinciden.", "error");
        return;
      }
    }

    try {
      const payload = {
        nombreUsuario: formUsuario.nombreUsuario
      };
      if (formUsuario.password) {
        payload.password = formUsuario.password;
      }

      const response = await actualizarUsuario(payload);
      
      // Sincronizar en el context el usuario DTO retornado
      actualizarUsuarioContexto(response);

      setFormUsuario({
        nombreUsuario: response.nombreUsuario,
        password: "",
        confirmPassword: ""
      });

      setIsEditingUsuario(false);
      showAlert("Datos de la cuenta actualizados correctamente.", "success");
    } catch (err) {
      const fueManejado = handleApiError(err, navigate);
      if (!fueManejado) {
        console.error("Error al guardar cuenta:", err);
        showAlert(err.response?.data?.message || err.message || "Error al actualizar la cuenta.", "error");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 , alignItems: "center", minHeight: "50vh"}}>
        <CircularProgress />
      </Box>
    );
  }

  if (!perfil) return null;

  const planesDisponibles = obrasSociales.find((os) => os.id === formCobertura.obraSocial)?.planes ?? [];

  return (
    <main ref={mainRef} tabIndex={-1} className="container-perfil">
      
      {/* Encabezado Principal */}
      <Box className="perfil-card" sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}>
        <Avatar 
          sx={{ 
            width: 90, 
            height: 90, 
            fontSize: "32px", 
            fontWeight: "bold",
            background: "linear-gradient(135deg, var(--color-info) 0%, var(--color-info-dark) 100%)",
            color: "white",
            mb: 2
          }}
        >
          {perfil.nombre?.[0]?.toUpperCase() ?? "U"}{perfil.apellido ? perfil.apellido.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 1 }}>
            {perfil.nombre} {perfil.apellido || ''}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1.5}>
            <Typography variant="overline" sx={{ color: 'var(--color-info)', fontWeight: 700, letterSpacing: '0.8px' }}>
              {user?.rol === "PACIENTE" ? "Paciente" : "Médico Especialista"}
            </Typography>
            <Chip 
              label={user?.rol === "PACIENTE" ? `DNI: ${perfil.dni}` : `Matrícula: ${perfil.matricula}`} 
              size="small" 
              sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text-muted)', fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Box>

      {/* TARJETA GRANDE DE PERFIL */}
      <Box className="perfil-card">
        
        {/* FORMULARIO DE DATOS DE PERFIL (Datos Personales + Cobertura si corresponde) */}
        <Box component="form" onSubmit={handleGuardarPerfil}>
          
          {/* SECCIÓN: DATOS PERSONALES */}
          <section aria-labelledby="section-datos-personales" className="perfil-section">
            <Box className="card-title-custom">
              <Typography id="section-datos-personales" variant="subtitle1" component="h2" sx={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', m: 0 }}>
                Datos Personales
              </Typography>
              {isEditingPerfil ? (
                <Box display="flex" gap={1.5}>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={handleCancelarPerfil}
                    startIcon={<Cancel />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                  >
                    Confirmar
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={handleEditarPerfil}
                  aria-label="Editar datos personales y cobertura"
                >
                  Editar
                </Button>
              )}
            </Box>
            
            <Box sx={{ pt: 1 }}>
              {isEditingPerfil ? (
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <TextField
                      fullWidth
                      inputRef={nombreRef}
                      label="Nombre Completo"
                      value={formPerfil.nombre}
                      onChange={(e) => setFormPerfil({ ...formPerfil, nombre: e.target.value })}
                      required
                    />
                    {user?.rol === "PACIENTE" && (
                      <TextField
                        fullWidth
                        label="DNI"
                        type="number"
                        value={formPerfil.dni}
                        onChange={(e) => setFormPerfil({ ...formPerfil, dni: e.target.value })}
                        required
                        inputProps={{ min: 1000000 }}
                        sx={{
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield'
                          },
                          '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                          },
                          '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                          }
                        }}
                      />
                    )}
                    {user?.rol === "MEDICO" && (
                      <TextField
                        fullWidth
                        label="Honorario Base (ARS)"
                        type="number"
                        value={formPerfil.honorario}
                        onChange={(e) => setFormPerfil({ ...formPerfil, honorario: e.target.value })}
                        required
                        inputProps={{ min: 0 }}
                        sx={{
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield'
                          },
                          '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                          },
                          '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                          }
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={8}>
                  <Box>
                    <Typography className="perfil-label">Nombre Completo</Typography>
                    <Typography className="perfil-value">{perfil.nombre}</Typography>
                  </Box>
                  {user?.rol === "PACIENTE" && (
                    <Box>
                      <Typography className="perfil-label">DNI</Typography>
                      <Typography className="perfil-value">{perfil.dni}</Typography>
                    </Box>
                  )}
                  {user?.rol === "MEDICO" && (
                    <Box>
                      <Typography className="perfil-label">Honorario Base</Typography>
                      <Typography className="perfil-value" color="success.main" sx={{ fontWeight: 700 }}>
                        ${Number(perfil.honorario).toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </section>

          {/* SECCIÓN: COBERTURA MÉDICA (Solo Pacientes) */}
          {user?.rol === "PACIENTE" && (
            <section aria-labelledby="section-cobertura-medica" className="perfil-section">
              <Box className="card-title-custom">
                <Typography id="section-cobertura-medica" variant="subtitle1" component="h2" sx={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', m: 0 }}>
                  Cobertura Médica
                </Typography>
              </Box>

              <Box sx={{ pt: 1 }}>
                {isEditingPerfil ? (
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel id="os-label">Obra Social</InputLabel>
                        <Select
                          labelId="os-label"
                          label="Obra Social"
                          value={formCobertura.obraSocial}
                          onChange={(e) => setFormCobertura({ obraSocial: e.target.value, plan: "" })}
                        >
                          <MenuItem value=""><em>Ninguna</em></MenuItem>
                          {obrasSociales.map((os) => (
                            <MenuItem key={os.id} value={os.id}>{os.nombre}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth disabled={!formCobertura.obraSocial}>
                        <InputLabel id="plan-label">Plan</InputLabel>
                        <Select
                          labelId="plan-label"
                          label="Plan"
                          value={formCobertura.plan}
                          onChange={(e) => setFormCobertura({ ...formCobertura, plan: e.target.value })}
                        >
                          <MenuItem value=""><em>Ningún plan</em></MenuItem>
                          {planesDisponibles.map((plan) => (
                            <MenuItem key={plan.id} value={plan.id}>{plan.nombre}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={8}>
                    <Box>
                      <Typography className="perfil-label">Obra Social</Typography>
                      <Typography className="perfil-value">{perfil.obraSocial?.nombre || "No tiene obra social cargada"}</Typography>
                    </Box>
                    {perfil.obraSocial && (
                      <Box>
                        <Typography className="perfil-label">Plan</Typography>
                        <Typography className="perfil-value">{perfil.plan?.nombre || "Sin plan específico"}</Typography>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </section>
          )}

        </Box>

        {/* FORMULARIO DE CUENTA Y SEGURIDAD */}
        <Box component="form" onSubmit={handleGuardarUsuario} sx={{ mt: 4 }}>
          
          {/* SECCIÓN: CUENTA Y SEGURIDAD */}
          <section aria-labelledby="section-cuenta-seguridad">
            <Box className="card-title-custom">
              <Typography id="section-cuenta-seguridad" variant="subtitle1" component="h2" sx={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', m: 0 }}>
                Cuenta y Seguridad
              </Typography>
              {isEditingUsuario ? (
                <Box display="flex" gap={1.5}>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={handleCancelarUsuario}
                    startIcon={<Cancel />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                  >
                    Confirmar
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={handleEditarUsuario}
                  aria-label="Editar cuenta y contraseña"
                >
                  Editar
                </Button>
              )}
            </Box>
            
            <Box sx={{ pt: 1 }}>
              {isEditingUsuario ? (
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        inputRef={usuarioRef}
                        label="Nombre de Usuario (Email)"
                        value={formUsuario.nombreUsuario}
                        onChange={(e) => setFormUsuario({ ...formUsuario, nombreUsuario: e.target.value })}
                        required
                        helperText="Se utilizará para iniciar sesión"
                      />
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Nueva Contraseña"
                        value={formUsuario.password}
                        onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                        inputProps={{ minLength: 8 }}
                        helperText="Dejá en blanco si no deseas cambiarla (Mínimo 8 caracteres, una mayúscula, una minúscula y un número)"
                      />
                      {formUsuario.password && (
                        <TextField
                          fullWidth
                          type="password"
                          label="Confirmar Nueva Contraseña"
                          value={formUsuario.confirmPassword}
                          inputProps={{ minLength: 8 }}
                          onChange={(e) => setFormUsuario({ ...formUsuario, confirmPassword: e.target.value })}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={8}>
                  <Box>
                    <Typography className="perfil-label">Nombre de Usuario</Typography>
                    <Typography className="perfil-value">{user?.nombreUsuario || "Desconocido"}</Typography>
                  </Box>
                  <Box>
                    <Typography className="perfil-label">Contraseña</Typography>
                    <Typography className="perfil-value">••••••••</Typography>
                  </Box>
                </Stack>
              )}
            </Box>
          </section>

        </Box>

      </Box>

    </main>
  );
}
