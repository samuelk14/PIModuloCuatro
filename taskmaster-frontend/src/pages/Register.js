import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Obtener parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("taskId"); // Tarea a la que fue invitado
  const invitedEmail = queryParams.get("email");

  // Prellenar el campo de email si se viene de una invitación
  useEffect(() => {
    if (invitedEmail) {
      setFormData((prevFormData) => ({ ...prevFormData, email: invitedEmail }));
    }
  }, [invitedEmail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      // Verificar si la respuesta tiene el código de estado 201 (creado)
      if (response.status === 201) {
        if (taskId) {
          // Si fue invitado, agregarlo a la tarea
          await axios.post(
            `http://localhost:5000/api/tasks/${taskId}/add-user`,
            {
              userId: response.data.userId, // ID del usuario recién creado
            }
          );
        }
        alert("Registro exitoso");
        navigate("/login"); // Redirigir al login después del registro exitoso
      } else {
        throw new Error("Registro fallido");
      }
    } catch (error) {
      console.error("Error en el registro", error);
      const errorMessage =
        error.response?.data?.error || "Error en el registro";
      alert(errorMessage); // Aquí se mostrará el mensaje real del error
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
