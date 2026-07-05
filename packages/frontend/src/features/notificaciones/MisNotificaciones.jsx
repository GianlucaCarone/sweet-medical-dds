import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  Divider,
  Pagination,
  Button,
  Skeleton,
  Fade
} from "@mui/material";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "../../context/NotificacionContext";
import { getNotificacionesMe } from "../../api/notificacion";
import ItemNotificacion from "../../components/headers/ItemNotificacion";

export default function MisNotificaciones() {
  const navigate = useNavigate();
  const { marcarComoLeida, marcarComoNoLeida, marcarTodasComoLeidas, obtenerNotificaciones, cantidadNoLeidas } = useNotificaciones();

  const [tabValue, setTabValue] = useState(0);
  const [cargando, setCargando] = useState(false);
  
  // Estado local de notificaciones para el historial completo
  const [notificaciones, setNotificaciones] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8; // 8 notificaciones por página para que sea espacioso

  const cargarHistorial = useCallback(async (isLeido, pagina) => {
    try {
      setCargando(true);
      const res = await getNotificacionesMe(isLeido, pagina, limit);
      setNotificaciones(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
      setPage(res.page || 1);
    } catch (error) {
      console.error("[MisNotificaciones]: Error al obtener historial", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarHistorial(tabValue === 1, page);
  }, [tabValue, page, cargarHistorial]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Volver a la página 1 al cambiar de pestaña
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleMarcarLeida = async (id) => {
    await marcarComoLeida(id);
    // Recargar la página actual del historial local
    cargarHistorial(tabValue === 1, page);
  };

  const handleMarcarNoLeida = async (id) => {
    await marcarComoNoLeida(id);
    cargarHistorial(tabValue === 1, page);
  };

  const handleMarcarTodas = async () => {
    await marcarTodasComoLeidas();
    setPage(1);
    cargarHistorial(tabValue === 1, 1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Botón de volver */}
      <Button
        startIcon={<KeyboardBackspaceIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold' }}
      >
        Volver
      </Button>

      <Fade in={true} timeout={400}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Cabecera */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Gestiona y revisa todas tus alertas y avisos del centro médico.
              </Typography>
            </Box>

            {tabValue === 0 && totalItems > 0 && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMarcarTodas}
                sx={{ textTransform: 'none', borderRadius: '20px', fontWeight: 'bold' }}
              >
                Marcar todo como leído
              </Button>
            )}
          </Box>

          {/* Pestañas */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="historial tabs">
              <Tab
                label={cantidadNoLeidas > 0 ? `Sin leer (${cantidadNoLeidas})` : "Sin leer"}
                sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '16px' }}
              />
              <Tab
                label="Leídas"
                sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '16px' }}
              />
            </Tabs>
          </Box>

          {/* Listado */}
          <Box sx={{ minHeight: 350, display: 'flex', flexDirection: 'column' }}>
            {cargando ? (
              <Box sx={{ width: '100%', py: 2 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ mb: 2.5, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
                    <Skeleton variant="text" width="80%" height={22} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
                      <Skeleton variant="text" width="40%" height={16} />
                      <Skeleton variant="text" width="20%" height={16} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : notificaciones.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
                py={6}
              >
                <NotificationsOffIcon
                  sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }}
                />
                <Typography variant="h6" color="text.secondary" fontWeight="600">
                  Historial vacío
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {tabValue === 0
                    ? 'No tienes notificaciones sin leer.'
                    : 'No tienes notificaciones leídas registradas.'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1 }}>
                <List disablePadding>
                  {notificaciones.map((n, index) => (
                    <React.Fragment key={n.id || index}>
                      <ItemNotificacion
                        notificacion={n}
                        onMarcarLeida={handleMarcarLeida}
                        onMarcarNoLeida={handleMarcarNoLeida}
                        pantallaCompleta={true}
                      />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </Box>

          {/* Paginación */}
          {!cargando && totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Paper>
      </Fade>
    </Container>
  );
}
