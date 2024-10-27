import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import Logout from './pages/Logout';
import Header from './components/Header'; // Importar el componente Header
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <Router>
      <HeaderWithRoutes />
    </Router>
  );
};

const HeaderWithRoutes = () => {
  const location = useLocation();

  // Rutas en las que no se debe mostrar el Header
  const noHeaderRoutes = ['/login', '/register', '/forgot-password', '/logout'];

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas usando PrivateRoute */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;