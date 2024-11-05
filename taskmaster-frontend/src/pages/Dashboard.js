import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import TaskModal from '../components/TaskModal';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedTask, setSelectedTask] = useState(null); // Estado para almacenar la tarea seleccionada
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
    console.log("handleTaskUpdate ejecutado con", taskId, updatedFields); // Verificar si se llama
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Actualizar los campos en el estado local
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedFields } : task
      ));

      if (taskId === selectedTask?.id) {
        setSelectedTask((prevTask) => ({ ...prevTask, ...updatedFields }));
      }
  
      // Cerrar el modal si la actualización proviene del mismo
      if (isModalOpen) closeModal();
      // setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar la tarea', error);
      alert('Error al actualizar la tarea');
    }
  };

  const handleTaskDelete = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      closeModal();
    } catch (error) {
      console.error('Error al eliminar la tarea', error);
      alert('Error al eliminar la tarea');
    }
  };
 
  // Abre el modal con la tarea seleccionada
  const handleTaskClick = (task) => {
    setSelectedTask(task);  // Selecciona la tarea seleccionada
    setIsModalOpen(true);    // Abre el modal
  };  

  // Cierra el modal y limpia la tarea seleccionada
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  console.log("Enviando handleTaskUpdate como onUpdateTask", handleTaskUpdate); // Confirmación de paso de función

  return (
    <div className="dashboard-container">
      <TaskForm onSubmit={handleNewTask} />
      <TaskBoard tasks={tasks} onTaskClick={handleTaskClick} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} />
      {selectedTask && isModalOpen && (
        <TaskModal 
          task={selectedTask} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onUpdateTask={handleTaskUpdate} 
          // onDeleteTask={handleTaskDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;
