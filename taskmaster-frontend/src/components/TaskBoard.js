import React from 'react';

const TaskBoard = ({ tasks, onTaskUpdate }) => {
  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <li key={task.id}>
          {task.title}: {task.description}
          <button onClick={() => handleStatusChange(task.id, task.status)}>
            {status === 'pendiente' ? 'Iniciar' : status === 'en progreso' ? 'Completar' : 'Reabrir'}
          </button>
        </li>
      ));
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pendiente' ? 'en progreso' : currentStatus === 'en progreso' ? 'completada' : 'pendiente';

    try {
      // Lógica para actualizar el estado de la tarea en el backend
      await onTaskUpdate(taskId, newStatus);
      alert(`Estado de la tarea cambiado a "${newStatus}"`);
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
