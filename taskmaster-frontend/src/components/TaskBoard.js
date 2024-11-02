import React, { useState } from 'react';
import './TaskBoard.css';

// Función para formatear la fecha y ajustar el desfase horario
const formatDate = (date) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().split('T')[0];
};

const TaskBoard = ({ tasks, onTaskUpdate }) => {
  const [editingTask, setEditingTask] = useState({});
  const [filters, setFilters] = useState({ sortBy: 'dueDate' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const renderTasks = (status) => {
    const filteredTasks = tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (filters.sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
        if (filters.sortBy === 'priority') {
          const priorities = { alta: 1, media: 2, baja: 3 };
          return priorities[a.priority] - priorities[b.priority];
        }
        return 0;
      });

    return filteredTasks.map((task) => (
      <div key={task.id} className={`task-item ${task.isPinned ? 'highlight' : ''}`}>
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
              value={editingTask[task.id].dueDate || formatDate(task.dueDate)}
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
        <button onClick={() => handlePinTask(task.id, !task.isPinned)}>
          {task.isPinned ? 'Desanclar' : 'Anclar'}
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
      const updatedTaskData = { ...editingTask[taskId] };
      await onTaskUpdate(taskId, updatedTaskData);
      setEditingTask((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    } else {
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
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea', error);
      alert('Error al cambiar el estado de la tarea');
    }
  };

  const handlePinTask = async (taskId, isPinned) => {
    try {
      await onTaskUpdate(taskId, { isPinned });
    } catch (error) {
      console.error('Error al anclar la tarea', error);
      alert('Error al anclar la tarea');
    }
  };

  return (
    <div className="task-board-container">
      <div className="task-column">
        <h3>Pendientes</h3>
        <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
          <option value="dueDate">Ordenar por Fecha</option>
          <option value="priority">Ordenar por Prioridad</option>
        </select>
        {renderTasks('pendiente')}
      </div>
      <div className="task-column">
        <h3>En Progreso</h3>
        <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
          <option value="dueDate">Ordenar por Fecha</option>
          <option value="priority">Ordenar por Prioridad</option>
        </select>
        {renderTasks('en progreso')}
      </div>
      <div className="task-column">
        <h3>Completadas</h3>
        <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
          <option value="dueDate">Ordenar por Fecha</option>
          <option value="priority">Ordenar por Prioridad</option>
        </select>
        {renderTasks('completada')}
      </div>
    </div>
  );
};

export default TaskBoard;
