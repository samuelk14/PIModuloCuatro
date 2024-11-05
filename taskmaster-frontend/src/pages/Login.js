import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [error] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); // Guarda el ID de usuario
      navigate('/dashboard'); // Redirige al Dashboard después de iniciar sesión
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      alert(error.response.data.error);
    }
  };

  
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />

        <button type="submit" className="login-button">Iniciar Sesión</button>

        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="login-footer">
          <p>¿Olvidaste tu contraseña? <Link to="/forgot-password" className="login-link">Recupérala aquí</Link></p>
          <p>¿No tienes cuenta? <Link to="/register" className="login-link">Regístrate aquí</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
