import React, { useState } from 'react';

const TaskBoard = ({ tasks, onTaskUpdate }) => {
  const [editingComment, setEditingComment] = useState({}); // Estado para manejar la edición de comentarios

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <li key={task.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
          <strong>{task.title}</strong>: {task.description}
          <div><strong>Fecha Límite:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
          <div><strong>Prioridad:</strong> <span className={`priority-${task.priority}`}>{task.priority}</span></div>
          <div>
            <em>Comentarios: </em>
            {editingComment[task.id] !== undefined ? (
              // Modo edición de comentario
              <textarea
                value={editingComment[task.id]}
                onChange={(e) => handleCommentChange(task.id, e.target.value)}
              />
            ) : (
              // Modo visualización de comentario
              <span>{task.comentarios || 'Sin comentarios'}</span>
            )}
            <button onClick={() => toggleEditComment(task.id)}>
              {editingComment[task.id] !== undefined ? 'Guardar' : 'Editar Comentario'}
            </button>
          </div>
          <button onClick={() => handleStatusChange(task.id, task.status)}>
            {status === 'pendiente' ? 'Iniciar' : status === 'en progreso' ? 'Completar' : 'Reabrir'}
          </button>
        </li>
      ));
  };

  const handleCommentChange = (taskId, comment) => {
    setEditingComment(prev => ({ ...prev, [taskId]: comment })); // Actualiza el estado del comentario en edición
  };

  const toggleEditComment = async (taskId) => {
    if (editingComment[taskId] !== undefined) {
      // Si ya se está editando, guarda el comentario y cierra la edición
      await onTaskUpdate(taskId, { comentarios: editingComment[taskId] });
      setEditingComment(prev => ({ ...prev, [taskId]: undefined })); // Limpia el campo de edición
    } else {
      // Habilita el campo de edición con el comentario actual
      const task = tasks.find(t => t.id === taskId);
      setEditingComment(prev => ({ ...prev, [taskId]: task.comentarios || '' }));
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
    <div>
      <h2>Tablero de Tareas</h2>
      <div>
        <h3>Pendientes</h3>
        <ul>{renderTasks('pendiente')}</ul>
      </div>
      <div>
        <h3>En Progreso</h3>
        <ul>{renderTasks('en progreso')}</ul>
      </div>
      <div>
        <h3>Completadas</h3>
        <ul>{renderTasks('completada')}</ul>
      </div>
    </div>
  );
};

export default TaskBoard;
