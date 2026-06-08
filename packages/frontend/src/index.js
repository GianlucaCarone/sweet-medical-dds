import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext.jsx"; // Importamos el Provider del contexto de autenticación

const theme = createTheme({
  palette: {
    primary: { main: "#1a62b9ff" }, //TODO Los colores de boquita papa (después los cambiamos)
    secondary: { main: "#FFC200" }
  },
  typography: {
    fontFamily: [
      '"Poppins"', // Cambia "Poppins" por la fuente que hayas elegido para el TP
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
      {/* CssBaseline inyecta los estilos globales, incluyendo el fontFamily al body */}
      <CssBaseline /> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
