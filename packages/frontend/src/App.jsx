import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./features/layout/Layout.jsx";
import Login from "./components/login/Login.jsx";
import MisTurnos from "./features/misTurnos/MisTurnos.jsx";
import BusquedaTurnos from "./features/busqueda-turnos/busquedaTurnos.jsx";
import PerfilMedico from "./features/perfil-medico/PerfilMedico.jsx";
import MiPerfil from "./features/perfil-usuario/MiPerfil.jsx";
import { CartProvider } from './context/CartContext.jsx';
import { AlertProvider } from "./context/AlertContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Home from "./features/home/Home.jsx"

import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  /*
  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);
  */

  return (
    <AlertProvider>
      <CartProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout />
            }>
            {/* Búsqueda de turnos: visible sin login (el TP lo muestra en búsqueda pública) */}
            <Route
              path="busqueda-turnos"
              element={
                <BusquedaTurnos />
              }
            />

            {/* Mis Turnos: solo para PACIENTE logueado */}
            <Route
              path="mis-turnos"
              element={
                <ProtectedRoute allowedRoles={["PACIENTE"]}>
                  <MisTurnos />
                </ProtectedRoute>
              }
            />

            {/* Mi Perfil: cualquier usuario logueado */}
            <Route
              path="mi-perfil"
              element={
                <ProtectedRoute>
                  <MiPerfil />
                </ProtectedRoute>
              }
            />

            {/* Perfil Médico: solo para MEDICO logueado */}
            <Route
              path="perfil-medico"
              element={
                <ProtectedRoute allowedRoles={["MEDICO"]}>
                  <PerfilMedico />
                </ProtectedRoute>
              }
            />

            <Route index element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;

