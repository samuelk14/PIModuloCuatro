import React, { useState, useEffect } from "react";
import "./TaskModal.css";

const TaskModal = ({ task, isOpen, onClose, onUpdateTask, onDeleteTask }) => {
  const [editingTask, setEditingTask] = useState(task || {});
  const [newInvitedEmail, setNewInvitedEmail] = useState("");

  useEffect(() => {
    setEditingTask(task || {}); // Actualiza `editingTask` cada vez que cambia `task`
    setNewInvitedEmail("");
  }, [task, onUpdateTask]);

  if (!isOpen || !task) return null;

  const handleInputChange = (field, value) => {
    setEditingTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedTask = { ...editingTask };
    if (newInvitedEmail) {
      updatedTask.newInvitedUsers = [newInvitedEmail];
    }

    onUpdateTask(task.id, updatedTask);
    setNewInvitedEmail(""); // Limpia el campo de nuevo invitado después de guardar
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteTask && typeof onDeleteTask === "function") {
      onDeleteTask(task.id); // Llamar a la función de eliminación
      onClose(); // Cerrar el modal
    } else {
      console.error("'onDeleteTask' no está definido o no es una función.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        <h2>
          <input
            type="text"
            value={editingTask.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Título"
          />
        </h2>

        <div>
          <label>Descripción:</label>
          <textarea
            value={editingTask.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div>
          <label>Fecha Límite:</label>
          <input
            type="date"
            value={editingTask.dueDate ? editingTask.dueDate.split("T")[0] : ""}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
        </div>

        <div>
          <label>Prioridad:</label>
          <select
            value={editingTask.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div>
          <label>Comentarios:</label>
          <textarea
            value={editingTask.comentarios || ""}
            onChange={(e) => handleInputChange("comentarios", e.target.value)}
            placeholder="Agregar comentarios"
          />
        </div>

        <div>
          <label>Invitar usuario (correo):</label>
          <input
            type="email"
            value={newInvitedEmail}
            onChange={(e) => setNewInvitedEmail(e.target.value)}
            placeholder="Correo de nuevo invitado"
          />
        </div>

        <p>
          <strong>Estado:</strong> {task.status}
        </p>

        <button
          onClick={() => onUpdateTask(task.id, { isPinned: !task.isPinned })}
          className="pin-button"
        >
          {task.isPinned ? "Desanclar" : "Anclar"}
        </button>

        <button onClick={handleSave} className="save-button">
          Guardar Cambios
        </button>

        <button onClick={handleDelete} className="delete-button">
          Eliminar Tarea
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
