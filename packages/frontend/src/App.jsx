import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./features/layout/Layout.jsx";
import Login from "./components/login/Login.jsx";
import MisTurnos from "./features/misTurnos/MisTurnos.jsx";
import BusquedaTurnos from "./features/busqueda-turnos/busquedaTurnos.jsx";
import PerfilMedico from "./features/perfil-medico/PerfilMedico.jsx";
import { CartProvider } from './context/CartContext.jsx';
import { AlertProvider } from "./context/AlertContext.jsx";
import Home from "./features/home/Home.jsx";

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
            <Route
              path="busqueda-turnos"
              element={
                <BusquedaTurnos />
              }
            />

            <Route
              path="mis-turnos"
              element={<MisTurnos />}
            />

            <Route
              path="perfil-medico"
              element={<PerfilMedico />}
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
