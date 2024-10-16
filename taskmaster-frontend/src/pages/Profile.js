import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error al cargar el perfil', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Perfil</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Correo:</strong> {user.email}</p>
      <button onClick={() => window.location.href = '/edit-profile'}>Editar Perfil</button>
    </div>
  );
};

export default Profile;
