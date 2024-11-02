import React, { useState } from 'react';
import './TaskBoard.css';

// Función para formatear la fecha y ajustar el desfase horario
const formatDate = (date) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().split('T')[0];
};

const TaskBoard = ({ tasks, onTaskUpdate, onEditTask }) => {
  const [editingTask, setEditingTask] = useState({}); // Estado para manejar la edición de tareas

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div key={task.id} className="task-item">
          {editingTask[task.id] ? (
            <>
              <input
                type="text"
                value={editingTask[task.id].title}
                onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
              />
              <textarea
                value={editingTask[task.id].description}
                onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
              />
              <input
                type="date"
                value={editingTask[task.id].dueDate || formatDate(task.dueDate)} // Prellenar el campo de fecha
                onChange={(e) => handleTaskChange(task.id, 'dueDate', e.target.value)}
              />
              <select
                value={editingTask[task.id].priority}
                onChange={(e) => handleTaskChange(task.id, 'priority', e.target.value)}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <textarea
                value={editingTask[task.id].comentarios}
                onChange={(e) => handleTaskChange(task.id, 'comentarios', e.target.value)}
                placeholder="Comentarios"
              />
              <input
                type="email"
                value={editingTask[task.id].newInvitedEmail || ''}
                onChange={(e) => handleTaskChange(task.id, 'newInvitedEmail', e.target.value)}
                placeholder="Correo de nuevo invitado"
              />
            </>
          ) : (
            <>
              <strong>{task.title}</strong>: {task.description}
              <div><strong>Fecha Límite:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
              <div><strong>Prioridad:</strong> <span className={`priority-${task.priority}`}>{task.priority}</span></div>
              <div><em>Comentario:</em> {task.comentarios || 'Sin comentarios'}</div>
            </>
          )}
          <button onClick={() => toggleEditTask(task.id, task)}>
            {editingTask[task.id] ? 'Guardar' : 'Modificar'}
          </button>
          <button onClick={() => handleStatusChange(task.id, task.status)}>
            {status === 'pendiente' ? 'Iniciar' : status === 'en progreso' ? 'Completar' : 'Reabrir'}
          </button>
        </div>
      ));
  };

  const handleTaskChange = (taskId, field, value) => {
    setEditingTask((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], [field]: value },
    }));
  };

  const toggleEditTask = async (taskId, task) => {
    if (editingTask[taskId]) {
      // Guardar cambios
      const updatedTaskData = { ...editingTask[taskId] };
      if (updatedTaskData.newInvitedEmail) {
        updatedTaskData.newInvitedUsers = [updatedTaskData.newInvitedEmail];
        delete updatedTaskData.newInvitedEmail;
      }

      await onTaskUpdate(taskId, updatedTaskData);
      setEditingTask((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    } else {
      // Iniciar edición
      setEditingTask((prev) => ({
        ...prev,
        [taskId]: {
          title: task.title,
          description: task.description,
          dueDate: formatDate(task.dueDate),
          priority: task.priority,
          comentarios: task.comentarios || '',
        },
      }));
    }
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pendiente' ? 'en progreso' : currentStatus === 'en progreso' ? 'completada' : 'pendiente';
    try {
      await onTaskUpdate(taskId, { status: newStatus });
      //alert(`Estado de la tarea cambiado a "${newStatus}"`);
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea', error);
      alert('Error al cambiar el estado de la tarea');
    }
  };

  return (
    <div className="task-board-container">
      <div className="task-column">
        <h3>Pendientes</h3>
        {renderTasks('pendiente')}
      </div>
      <div className="task-column">
        <h3>En Progreso</h3>
        {renderTasks('en progreso')}
      </div>
      <div className="task-column">
        <h3>Completadas</h3>
        {renderTasks('completada')}
      </div>
    </div>
  );
};

export default TaskBoard;
