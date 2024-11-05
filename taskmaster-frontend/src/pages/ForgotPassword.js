import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('Se ha enviado un enlace de recuperación a tu correo');
      navigate('/login'); // Redirige al inicio de sesión después de enviar la solicitud
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña', error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2 className="forgot-password-title">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-password-input"
          />
          <button type="submit" className="forgot-password-button">Recuperar</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
