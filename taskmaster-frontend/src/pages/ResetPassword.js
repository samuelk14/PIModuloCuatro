import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const { token } = useParams(); // Obtener el token desde la URL
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        token, // Enviar el token al backend
        password: formData.password
      });
      alert('Contraseña restablecida exitosamente');
      navigate('/login'); // Redirigir al inicio de sesión
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      alert(error.response?.data?.error || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2 className="reset-password-title">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Nueva Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="reset-password-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Nueva Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="reset-password-input"
            required
          />
          <button type="submit" className="reset-password-button">Restablecer Contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
