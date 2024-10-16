import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          name: response.data.name,
          email: response.data.email
        });
      } catch (error) {
        console.error('Error al cargar el perfil', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Perfil actualizado con éxito');
      console.log(response.data);
      window.location.href = '/profile'; 
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      alert(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
        <input type="password" name="currentPassword" placeholder="Contraseña Actual" onChange={handleChange} />
        <input type="password" name="newPassword" placeholder="Nueva Contraseña" onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirmar Nueva Contraseña" onChange={handleChange} />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditProfile;
