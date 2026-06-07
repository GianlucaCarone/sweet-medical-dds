import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./features/layout/Layout.jsx";
import MisTurnos from "./features/misTurnos/MisTurnos.jsx";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="mis-turnos" element={<MisTurnos />} />
        {/* <Route index element={<Home />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
