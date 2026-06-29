import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext.jsx'; // Importamos el Provider del contexto de autenticación
import { ThemeProvider } from '@mui/material/styles';
import getTheme from './theme';

function Root() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const theme = getTheme(mode);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);

    const r = document.documentElement.style;
    r.setProperty('--color-primary', theme.palette.primary.main);
    r.setProperty('--color-primary-light', theme.palette.primary.light);
    r.setProperty('--color-primary-dark', theme.palette.primary.dark);
    r.setProperty('--color-secondary', theme.palette.secondary.main);
    r.setProperty('--color-success', theme.palette.success.main);
    r.setProperty('--color-success-light', theme.palette.success.light);
    r.setProperty('--color-success-dark', theme.palette.success.dark);
    r.setProperty('--color-warning', theme.palette.warning.main);
    r.setProperty('--color-warning-light', theme.palette.warning.light);
    r.setProperty('--color-warning-dark', theme.palette.warning.dark);
    r.setProperty('--color-error', theme.palette.error.main);
    r.setProperty('--color-error-light', theme.palette.error.light);
    r.setProperty('--color-error-dark', theme.palette.error.dark);
    r.setProperty('--color-info', theme.palette.info.main);
    r.setProperty('--color-info-light', theme.palette.info.light);
    r.setProperty('--color-info-dark', theme.palette.info.dark);
    r.setProperty('--color-neutral', theme.palette.neutral.main);
    r.setProperty('--color-neutral-light', theme.palette.neutral.light);
    r.setProperty('--color-neutral-dark', theme.palette.neutral.dark);
    r.setProperty('--color-bg', theme.palette.background.default);
    r.setProperty('--color-surface', theme.palette.background.paper);
    r.setProperty('--color-text', theme.palette.text.primary);
    r.setProperty('--color-text-muted', theme.palette.text.secondary);
    r.setProperty('--color-divider', theme.palette.divider);
    r.setProperty('--color-avatar-bg', theme.palette.primary.main);
    r.setProperty('--color-avatar-text', theme.palette.primary.contrastText);
    r.setProperty('--color-divider', theme.palette.divider);

    document.documentElement.setAttribute('data-theme', mode);
  }, [mode, theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App toggleTheme={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
