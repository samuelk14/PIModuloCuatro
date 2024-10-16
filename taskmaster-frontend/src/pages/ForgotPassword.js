import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('Se ha enviado un enlace de recuperación a tu correo');
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña', error);
      alert(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Recuperar</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
