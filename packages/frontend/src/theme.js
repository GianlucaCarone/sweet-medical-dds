import { createTheme } from '@mui/material/styles'
const theme = createTheme({
  palette: {
    primary: { main: '#087f73', light: '#1976D2', dark: '#0D47A1' },
    success: { main: '#43A047' },
    warning: { main: '#EF6C00' },
    error: { main: '#C62828' },
    background: { default: '#F5F5F5', paper: '#FFFFFF' },
    text: { primary: '#212121', secondary: '#757575' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '24px', fontWeight: 600 },
    h2: { fontSize: '20px', fontWeight: 600 },
    h3: { fontSize: '16px', fontWeight: 600 },
    body1: { fontSize: '14px' },
    body2: { fontSize: '12px' }
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } }
    }
  }
})
export default theme
