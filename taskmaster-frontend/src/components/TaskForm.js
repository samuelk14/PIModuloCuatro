import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'media',
    status: 'pendiente',
    invitedEmail: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Envía los datos al componente padre para su manejo
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'media',
      status: 'pendiente',
      invitedEmail: ''
    });
  };

  return (
    <div className="task-form-modal-overlay" onClick={onClose}>
      <div className="task-form-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="task-form-close-button" onClick={onClose}>X</button>
        <form className="task-form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            className="task-form-input"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            className="task-form-textarea"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="task-form-input"
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="task-form-select"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="task-form-select"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
          <input
            type="email"
            name="invitedEmail"
            placeholder="Correo del invitado"
            value={formData.invitedEmail}
            onChange={handleChange}
            className="task-form-input"
          />
          <button type="submit" className="task-form-button">Crear Tarea</button>
        </form>
      </div>
    </div>
  ); 
};

export default TaskForm;
