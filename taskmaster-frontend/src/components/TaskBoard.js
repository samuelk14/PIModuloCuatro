import React, { useState } from 'react';
import './TaskBoard.css';
import TaskModal from './TaskModal';


const TaskBoard = ({ tasks, onTaskClick, onTaskUpdate, onTaskDelete}) => {
  //const [editingTask, setEditingTask] = useState({});
  const [filters, setFilters] = useState({ sortBy: 'dueDate' });
  const [selectedTask, setSelectedTask] = useState(null); // Estado para la tarea seleccionada


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleTaskClick = (e, task) => {
    if (e.target.tagName !== 'BUTTON') {
      setSelectedTask(task);
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
        <div key={task.id} className={`task-item ${task.isPinned ? 'highlight' : ''}`} onClick={(e) => handleTaskClick(e, task)}>
          <strong>{task.title}</strong>: {task.description}
          <div><strong>Fecha Límite:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
          <div><strong>Prioridad:</strong> <span className={`priority-${task.priority}`}>{task.priority}</span></div>
          <div><em>Comentario:</em> {task.comentarios || 'Sin comentarios'}</div>
          <button onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, task.status); }}>
            {status === 'pendiente' ? 'Iniciar' : status === 'en progreso' ? 'Completar' : 'Reabrir'}
          </button>
        </div>
      ));
  };

  // const openTaskModal = (task) => {
  //   setSelectedTask(task);
  // };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  // const handleTaskChange = (taskId, field, value) => {
  //   setEditingTask((prev) => ({
  //     ...prev,
  //     [taskId]: { ...prev[taskId], [field]: value },
  //   }));
  // };

  // const toggleEditTask = async (taskId, task) => {
  //   if (editingTask[taskId]) {
  //     const updatedTaskData = { ...editingTask[taskId] };
  //     await onTaskUpdate(taskId, updatedTaskData);
  //     setEditingTask((prev) => {
  //       const updated = { ...prev };
  //       delete updated[taskId];
  //       return updated;
  //     });
  //   } else {
  //     setEditingTask((prev) => ({
  //       ...prev,
  //       [taskId]: {
  //         title: task.title,
  //         description: task.description,
  //         dueDate: formatDate(task.dueDate),
  //         priority: task.priority,
  //         comentarios: task.comentarios || '',
  //         isPinned: task.isPinned || false,
  //       },
  //     }));
  //   }
  // };

  

  // const handlePinTask = async (taskId, isPinned) => {
  //   try {
  //     await onTaskUpdate(taskId, { isPinned });
  //   } catch (error) {
  //     console.error('Error al anclar la tarea', error);
  //     alert('Error al anclar la tarea');
  //   }
  // };

  return (
    <div className="task-board-container">
      <TaskModal task={selectedTask} isOpen={!!selectedTask} onClose={closeTaskModal} onUpdateTask={onTaskUpdate} onDeleteTask={onTaskDelete} />
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
