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
  Divider,
  Chip
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";
import { getMiPerfil, actualizarPaciente } from "../../api/pacienteApi.js";
import { getMiPerfilMedico, updateMedico } from "../../api/medico.js";
import { getObrasSociales } from "../../api/obraSocialApi.js";
import { actualizarUsuario } from "../../api/usuarioApi.js";

import "../perfil-medico/PerfilMedico.css";

export default function MiPerfil() {
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [perfil, setPerfil] = useState(null);
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditingPerfil, setIsEditingPerfil] = useState(false);
  const [formPerfil, setFormPerfil] = useState({ nombre: "", dni: "", honorario: 0 });
  const nombreRef = useRef(null);

  const [isEditingCobertura, setIsEditingCobertura] = useState(false);
  const [formCobertura, setFormCobertura] = useState({ obraSocial: "", plan: "" });
  const coberturaRef = useRef(null);

  const [isEditingUsuario, setIsEditingUsuario] = useState(false);
  const [formUsuario, setFormUsuario] = useState({ nombreUsuario: "", password: "", confirmPassword: "" });
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
            obraSocial: pac.obraSocial?.id || "", 
            plan: pac.plan?.id || "" 
          });
        } else if (user?.rol === "MEDICO") {
          const med = await getMiPerfilMedico();
          setPerfil(med);
          setFormPerfil({ nombre: med.nombre || "", dni: "", honorario: med.honorario || 0 });
        }
        setFormUsuario({ nombreUsuario: user?.nombreUsuario || "", password: "", confirmPassword: "" });
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        showAlert("Error al cargar los datos del perfil.", "error");
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
      // Enfoca el contenedor principal para habilitar accesibilidad por teclado y scroll directo
      mainRef.current?.focus();
    }
  }, [loading, perfil]);

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
        const payload = { nombre: formPerfil.nombre, dni: Number(formPerfil.dni) };
        const updated = await actualizarPaciente(perfil.id, payload);
        setPerfil(prev => ({ ...prev, ...updated }));
      } else if (user.rol === "MEDICO") {
        const payload = { nombre: formPerfil.nombre, honorario: Number(formPerfil.honorario) };
        const updated = await updateMedico(payload);
        setPerfil(prev => ({ ...prev, ...updated }));
      }
      setIsEditingPerfil(false);
      showAlert("Datos personales actualizados correctamente.", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Error al actualizar datos personales.", "error");
    }
  };

  const handleGuardarCobertura = async (e) => {
    e.preventDefault();
    try {
      await actualizarPaciente(perfil.id, {
        obraSocial: formCobertura.obraSocial || null,
        plan: formCobertura.plan || null,
      });

      const obraSocialDoc = obrasSociales.find((os) => os.id === formCobertura.obraSocial);
      const planDoc = obraSocialDoc?.planes?.find((p) => p.id === formCobertura.plan);

      setPerfil((prev) => ({
        ...prev,
        obraSocial: obraSocialDoc ? { id: obraSocialDoc.id, nombre: obraSocialDoc.nombre } : null,
        plan: planDoc ? { id: planDoc.id, nombre: planDoc.nombre } : null,
      }));
      setIsEditingCobertura(false);
      showAlert("Cobertura médica actualizada correctamente.", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Error al actualizar cobertura médica.", "error");
    }
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    if (!formUsuario.nombreUsuario.trim()) {
      showAlert("El nombre de usuario es requerido.", "error");
      return;
    }
    if (formUsuario.password) {
      if (formUsuario.password.length < 6) {
        showAlert("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
      }
      if (formUsuario.password !== formUsuario.confirmPassword) {
        showAlert("Las contraseñas no coinciden.", "error");
        return;
      }
    }
    
    try {
      const payload = { nombreUsuario: formUsuario.nombreUsuario };
      if (formUsuario.password) {
        payload.password = formUsuario.password;
      }
      
      await actualizarUsuario(payload);
      
      setFormUsuario(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setIsEditingUsuario(false);
      showAlert("Datos de cuenta actualizados correctamente.", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Error al actualizar datos de cuenta.", "error");
    }
  };

  if (loading) {
    return (
      <main className="container-perfil" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </main>
    );
  }

  if (!perfil) return null;

  const planesDisponibles = obrasSociales.find((os) => os.id === formCobertura.obraSocial)?.planes ?? [];

  return (
    <main ref={mainRef} tabIndex={-1} className="container-perfil" style={{ outline: 'none' }}>
      
      {/* Encabezado Principal */}
      <Box className="perfil-card" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar 
          sx={{ 
            width: 72, 
            height: 72, 
            fontSize: "24px", 
            fontWeight: "bold",
            background: "linear-gradient(135deg, var(--color-info) 0%, var(--color-info-dark) 100%)",
            color: "white"
          }}
        >
          {perfil.nombre?.[0]?.toUpperCase() ?? "U"}{perfil.apellido ? perfil.apellido.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 0.5 }}>
            {perfil.nombre} {perfil.apellido || ''}
          </Typography>
          <Box display="flex" alignItems="center" gap={1.5}>
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

      {/* TODAS LAS SECCIONES DENTRO DE UNA ÚNICA TARJETA GRANDE */}
      <Box className="perfil-card">
        
        {/* SECCIÓN: DATOS PERSONALES */}
        <section aria-labelledby="section-datos-personales" style={{ marginBottom: '32px' }}>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="card-title-custom">
            <Typography id="section-datos-personales" variant="subtitle1" component="h2" sx={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', m: 0 }}>
              Datos Personales
            </Typography>
            {!isEditingPerfil && (
              <Button 
                startIcon={<Edit />} 
                onClick={() => {
                  setIsEditingPerfil(true);
                  setTimeout(() => nombreRef.current?.focus(), 100);
                }}
                size="small"
                aria-label="Editar datos personales"
              >
                Editar
              </Button>
            )}
          </Box>
          
          <Box sx={{ pt: 1 }}>
            {isEditingPerfil ? (
              <form onSubmit={handleGuardarPerfil} aria-label="Formulario de edición de datos personales">
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
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button 
                      color="error" 
                      variant="outlined"
                      onClick={() => {
                        setIsEditingPerfil(false);
                        setFormPerfil({ nombre: perfil.nombre, dni: perfil.dni, honorario: perfil.honorario });
                      }}
                      startIcon={<Cancel />}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      startIcon={<Save />}
                    >
                      Guardar
                    </Button>
                  </Box>
                </Stack>
              </form>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Nombre Completo</Typography>
                  <Typography variant="body1" fontWeight="600">{perfil.nombre}</Typography>
                </Box>
                {user?.rol === "PACIENTE" && (
                  <Box>
                    <Typography variant="overline" color="text.secondary">DNI</Typography>
                    <Typography variant="body1" fontWeight="600">{perfil.dni}</Typography>
                  </Box>
                )}
                {user?.rol === "MEDICO" && (
                  <Box>
                    <Typography variant="overline" color="text.secondary">Honorario Base</Typography>
                    <Typography variant="body1" fontWeight="700" color="success.main">${Number(perfil.honorario).toLocaleString('es-AR')}</Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </section>

        {/* SECCIÓN: COBERTURA MÉDICA (Solo Pacientes) */}
        {user?.rol === "PACIENTE" && (
          <section aria-labelledby="section-cobertura-medica" style={{ marginBottom: '32px' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="card-title-custom">
              <Typography id="section-cobertura-medica" variant="subtitle1" component="h2" sx={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', m: 0 }}>
                Cobertura Médica
              </Typography>
              {!isEditingCobertura && (
                <Button 
                  startIcon={<Edit />} 
                  onClick={() => {
                    setIsEditingCobertura(true);
                    setTimeout(() => coberturaRef.current?.focus(), 100);
                  }}
                  size="small"
                  aria-label="Editar cobertura médica"
                >
                  Editar
                </Button>
              )}
            </Box>

            <Box sx={{ pt: 1 }}>
              {isEditingCobertura ? (
                <form onSubmit={handleGuardarCobertura} aria-label="Formulario de edición de cobertura médica">
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel id="os-label">Obra Social</InputLabel>
                        <Select
                          labelId="os-label"
                          label="Obra Social"
                          inputRef={coberturaRef}
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
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button 
                        color="error" 
                        variant="outlined"
                        onClick={() => {
                          setIsEditingCobertura(false);
                          setFormCobertura({ obraSocial: perfil.obraSocial?.id || "", plan: perfil.plan?.id || "" });
                        }}
                        startIcon={<Cancel />}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        startIcon={<Save />}
                      >
                        Guardar
                      </Button>
                    </Box>
                  </Stack>
                </form>
              ) : (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">Obra Social</Typography>
                    <Typography variant="body1" fontWeight="600">{perfil.obraSocial?.nombre || "No tiene obra social cargada"}</Typography>
                  </Box>
                  {perfil.obraSocial && (
                    <Box>
                      <Typography variant="overline" color="text.secondary">Plan</Typography>
                      <Typography variant="body1" fontWeight="600">{perfil.plan?.nombre || "Sin plan específico"}</Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </section>
        )}

        {/* SECCIÓN: CUENTA Y SEGURIDAD */}
        <section aria-labelledby="section-cuenta-seguridad">
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="card-title-custom">
            <Typography id="section-cuenta-seguridad" variant="subtitle1" component="h2" sx={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', m: 0 }}>
              Cuenta y Seguridad
            </Typography>
            {!isEditingUsuario && (
              <Button 
                startIcon={<Edit />} 
                onClick={() => {
                  setIsEditingUsuario(true);
                  setTimeout(() => usuarioRef.current?.focus(), 100);
                }}
                size="small"
                aria-label="Editar cuenta y seguridad"
              >
                Editar
              </Button>
            )}
          </Box>
          
          <Box sx={{ pt: 1 }}>
            {isEditingUsuario ? (
              <form onSubmit={handleGuardarUsuario} aria-label="Formulario de edición de cuenta y seguridad">
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <TextField
                      fullWidth
                      inputRef={usuarioRef}
                      label="Nombre de Usuario (Email)"
                      value={formUsuario.nombreUsuario}
                      onChange={(e) => setFormUsuario({ ...formUsuario, nombreUsuario: e.target.value })}
                      required
                      helperText="Se utilizará para iniciar sesión"
                    />
                    <Stack spacing={2} fullWidth sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Nueva Contraseña"
                        value={formUsuario.password}
                        onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                        inputProps={{ minLength: 6 }}
                        helperText="Dejá en blanco si no deseas cambiarla"
                      />
                      {formUsuario.password && (
                        <TextField
                          fullWidth
                          type="password"
                          label="Confirmar Nueva Contraseña"
                          value={formUsuario.confirmPassword}
                          inputProps={{ minLength: 6 }}
                          onChange={(e) => setFormUsuario({ ...formUsuario, confirmPassword: e.target.value })}
                        />
                      )}
                    </Stack>
                  </Stack>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button 
                      color="error" 
                      variant="outlined"
                      onClick={() => {
                        setIsEditingUsuario(false);
                        setFormUsuario({ nombreUsuario: user?.nombreUsuario || "", password: "", confirmPassword: "" });
                      }}
                      startIcon={<Cancel />}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      startIcon={<Save />}
                    >
                      Guardar
                    </Button>
                  </Box>
                </Stack>
              </form>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Nombre de Usuario</Typography>
                  <Typography variant="body1" fontWeight="600">{user?.nombreUsuario || "Desconocido"}</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">Contraseña</Typography>
                  <Typography variant="body1" fontWeight="600">••••••••</Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </section>

      </Box>

    </main>
  );
}
