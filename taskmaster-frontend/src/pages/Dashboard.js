import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const userId = parseInt(localStorage.getItem('userId'), 10); // ID del usuario actual

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedTasks = response.data.map(task => ({
          ...task,
          isOwner: task.ownerId === userId // Comparar ID de propietario
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error al cargar las tareas', error);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleNewTask = async (taskData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, { ...response.data, isOwner: true }]); // Agrega la nueva tarea a la lista
    } catch (error) {
      console.error('Error al crear la tarea', error);
    }
  };

  const handleTaskUpdate = async (taskId, updatedFields) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map(task => 
        (task.id === taskId ? { ...task, ...updatedFields } : task // Actualiza los campos en el estado local
      )));
      //alert('Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la tarea', error);
      alert('Error al actualizar la tarea');
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
