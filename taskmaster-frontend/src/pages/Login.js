import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

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

  // // Redirección a la página de recuperación de contraseña
  // const handleForgotPassword = () => {
  //   navigate('/forgot-password');
  // };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required/>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div>
        <p>¿Olvidaste tu contraseña? <Link to="/forgot-password">Recupérala aquí</Link></p>
        <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};

export default Login;
