import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  // colores semánticos fijos
  const semantic = {
    success: '#43A047',
    successLight: '#e6f4ea',
    successDark: '#137333',
    warning: '#EF6C00',
    warningLight: '#ffedd5',
    warningDark: '#ea580c',
    error: '#C62828',
    errorLight: '#fee2e2',
    errorDark: '#dc2626',
    info: '#2563eb',
    infoLight: '#dbeafe',
    infoDark: '#1d4ed8',
    neutral: '#757575',
    neutralLight: '#f1f5f9',
    neutralDark: '#334155',
  };

  // colores semánticos para badges (manual de marca)
  const badgeColors = {
    DISPONIBLE: { main: '#087f73', light: '#e0f2f1', dark: '#065e54' },
    RESERVADO: { main: '#EF6C00', light: '#fff3e0', dark: '#e65100' },
    CONFIRMADO: { main: '#2563eb', light: '#dbeafe', dark: '#1e40af' },
    FINALIZADO: { main: '#43A047', light: '#e8f5e9', dark: '#2e7d32' },
    CANCELADO: { main: '#C62828', light: '#ffebee', dark: '#b71c1c' },
    PENDIENTECAMBIO: { main: '#9e9e9e', light: '#f5f5f5', dark: '#616161' },
    TOTAL: { main: '#43A047', light: '#e8f5e9', dark: '#2e7d32' },
    PARCIAL: { main: '#EF6C00', light: '#fff3e0', dark: '#e65100' },
    NO_CUBIERTA: { main: '#C62828', light: '#ffebee', dark: '#b71c1c' },
  };

  const darkBadgeColors = {
    DISPONIBLE: { main: '#4dd0c7', light: '#1a3a38', dark: '#087f73' },
    RESERVADO: { main: '#ffb74d', light: '#3d2a00', dark: '#EF6C00' },
    CONFIRMADO: { main: '#64b5f6', light: '#0d2137', dark: '#2563eb' },
    FINALIZADO: { main: '#81c784', light: '#1b3d1f', dark: '#43A047' },
    CANCELADO: { main: '#ef5350', light: '#3d1515', dark: '#C62828' },
    PENDIENTECAMBIO: { main: '#bdbdbd', light: '#2a2a2a', dark: '#9e9e9e' },
    TOTAL: { main: '#81c784', light: '#1b3d1f', dark: '#43A047' },
    PARCIAL: { main: '#ffb74d', light: '#3d2a00', dark: '#EF6C00' },
    NO_CUBIERTA: { main: '#ef5350', light: '#3d1515', dark: '#C62828' },
  };

  // paleta para light mode
  const lightPalette = {
    mode: 'light',
    primary: {
      main: '#087f73',
      light: '#0a9b8a',
      dark: '#065e54',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#757575',
      light: '#9e9e9e',
      dark: '#424242',
      contrastText: '#ffffff',
    },
    success: {
      main: semantic.success,
      light: semantic.successLight,
      dark: semantic.successDark,
      contrastText: semantic.successDark,
    },
    warning: {
      main: semantic.warning,
      light: semantic.warningLight,
      dark: semantic.warningDark,
      contrastText: semantic.warningDark,
    },
    error: {
      main: semantic.error,
      light: semantic.errorLight,
      dark: semantic.errorDark,
      contrastText: semantic.errorDark,
    },
    info: {
      main: semantic.info,
      light: semantic.infoLight,
      dark: semantic.infoDark,
      contrastText: semantic.infoDark,
    },
    neutral: {
      main: semantic.neutral,
      light: semantic.neutralLight,
      dark: semantic.neutralDark,
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#9ca3af',
    },
    divider: '#e2e8f0',
  };

  // dark mode
  const darkPalette = {
    mode: 'dark',
    primary: {
      main: '#087f73',
      light: '#0a9b8a',
      dark: '#065e54',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9ca3af',
      light: '#d1d5db',
      dark: '#6b7280',
      contrastText: '#111827',
    },
    success: {
      main: semantic.success,
      light: semantic.successLight,
      dark: semantic.successDark,
      contrastText: '#ffffff',
    },
    warning: {
      main: semantic.warning,
      light: semantic.warningLight,
      dark: semantic.warningDark,
      contrastText: '#ffffff',
    },
    error: {
      main: semantic.error,
      light: semantic.errorLight,
      dark: semantic.errorDark,
      contrastText: '#ffffff',
    },
    info: {
      main: semantic.info,
      light: semantic.infoLight,
      dark: semantic.infoDark,
      contrastText: '#ffffff',
    },
    neutral: {
      main: semantic.neutral,
      light: semantic.neutralLight,
      dark: semantic.neutralDark,
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#111827',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
    divider: '#374151',
  };

  return createTheme({
    palette: isDark ? darkPalette : lightPalette,
    customPalette: {
      badge: isDark ? darkBadgeColors : badgeColors,
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: { fontSize: '24px', fontWeight: 600 },
      h2: { fontSize: '20px', fontWeight: 600 },
      h3: { fontSize: '16px', fontWeight: 600 },
      body1: { fontSize: '14px' },
      body2: { fontSize: '12px' },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: { borderRadius: 12 },
    spacing: 4,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '999px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '6px 18px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '1px solid',
            borderColor: isDark ? '#374151' : '#e2e8f0',
            boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '1px 1px 1px grey',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '999px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
    },
  });
};

export default getTheme;
