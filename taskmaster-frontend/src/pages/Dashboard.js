import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error al cargar las tareas', error);
      }
    };

    fetchTasks();
  }, []);

  const handleNewTask = async (taskData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]); // Agrega la nueva tarea a la lista
    } catch (error) {
      console.error('Error al crear la tarea', error);
    }
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task))); // Actualiza el estado en el estado local
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea', error);
      alert('Error al actualizar el estado de la tarea');
    }
  };

  return (
    <div>
      <TaskForm onSubmit={handleNewTask} />
      <TaskBoard tasks={tasks} onTaskUpdate={handleTaskUpdate} />
    </div>
  );
};

export default Dashboard;
