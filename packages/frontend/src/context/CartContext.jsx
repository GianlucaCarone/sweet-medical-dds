import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializamos leyendo el Local Storage
  const [carrito, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem('sweetMedicalCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // Cada vez que el carrito cambie, guardamos en Local Storage
  useEffect(() => {
    localStorage.setItem('sweetMedicalCart', JSON.stringify(carrito));
  }, [carrito]);

  const manejoCarritoDrawer = {
    getCarritoAbierto: () => carritoAbierto,
    abrir: () => setCarritoAbierto(true),
    cerrar: () => setCarritoAbierto(false),
    toggle: () => setCarritoAbierto((prev) => !prev),
  };

  const agregarAlCarrito = (turno) => setCarrito([...carrito, turno]);
  const eliminarDelCarrito = (id) => setCarrito((prev) => prev.filter((_, i) => i !== id));
  const limpiarCarrito = () => setCarrito([]);
  const counterCarrito = () => carrito.length;
  const estaEnCarrito = (id) => carrito.some((t) => t.id === id);

  return (
    <CartContext.Provider value={{
      carrito,
      manejoCarritoDrawer,
      agregarAlCarrito,
      eliminarDelCarrito,
      limpiarCarrito,
      counterCarrito,
      estaEnCarrito
    }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);