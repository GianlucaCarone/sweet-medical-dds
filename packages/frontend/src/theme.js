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
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
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
          root: {
            backgroundColor: isDark ? '#1f2937' : '#f0fdf4',
            color: isDark ? '#34d399' : '#16a34a',
          },
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
