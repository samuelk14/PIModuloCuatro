import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

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
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Perfil</h2>
        <p className="profile-info"><strong>Nombre:</strong> {user.name}</p>
        <p className="profile-info"><strong>Correo:</strong> {user.email}</p>
        <button 
          className="profile-button edit"
          onClick={() => window.location.href = '/edit-profile'}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default Profile;
