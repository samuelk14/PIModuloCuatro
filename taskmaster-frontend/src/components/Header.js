import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">Perfil</Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-button">Cerrar Sesión</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
