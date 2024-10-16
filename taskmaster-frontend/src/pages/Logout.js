import React, { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }, []);

  return <h2>Cerrando sesión...</h2>;
};

export default Logout;
