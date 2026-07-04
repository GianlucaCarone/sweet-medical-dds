import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import getTheme from "../theme";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeContextProvider({ children }) {
    const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

    const toggleTheme = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

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

        document.documentElement.setAttribute('data-theme', mode);
    }, [mode, theme]);

    return <>
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    </>
}