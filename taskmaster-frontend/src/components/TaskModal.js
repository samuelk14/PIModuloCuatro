// src/components/TaskModal.js
import React from 'react';
import './TaskModal.css';

const TaskModal = ({ task, isOpen, onClose, onEditTask }) => {
  if (!isOpen || !task) return null;

//   const handleEditChange = (field, value) => {
//     onEditTask(task.id, { ...task, [field]: value });
//   };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>{task.title}</h2>
        <p><strong>Descripción:</strong> {task.description}</p>
        <p><strong>Fecha Límite:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
        <p><strong>Prioridad:</strong> <span className={`priority-${task.priority}`}>{task.priority}</span></p>
        <p><strong>Comentarios:</strong> {task.comentarios || 'Sin comentarios'}</p>
        <p><strong>Estado:</strong> {task.status}</p>
        <button onClick={() => onEditTask(task.id, { isPinned: !task.isPinned })}>
          {task.isPinned ? 'Desanclar' : 'Anclar'}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
