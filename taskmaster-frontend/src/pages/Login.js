import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      alert('Inicio de sesión exitoso');
      navigate('/dashboard'); // Redirige al Dashboard después de iniciar sesión
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      alert(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
