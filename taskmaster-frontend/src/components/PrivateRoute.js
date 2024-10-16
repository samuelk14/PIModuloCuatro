import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null; // Verifica si hay un token

  return isAuthenticated ? children : <Navigate to="/login" />; // Redirige a login si no está autenticado
};

export default PrivateRoute;
