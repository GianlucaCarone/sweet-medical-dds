import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./features/layout/Layout.jsx";
import BusquedaTurnos from "./features/busqueda-turnos/busquedaTurnos.jsx";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (turno) => {
    setCarrito([...carrito, turno]);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter((_, i) => i !== id));
  }

  const limpiarCarrito = () => {
    setCarrito([]);
  }

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout carrito={carrito}/>}>
        <Route 
          path="busqueda-turnos" 
          element={
            <BusquedaTurnos 
              carrito={carrito}
              agregarTurnoAlCarrito={agregarAlCarrito}
              eliminarTurnoDelCarrito={eliminarDelCarrito}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
