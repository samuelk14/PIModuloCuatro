const { Op } = require('sequelize'); // Importa Op desde Sequelize
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // Middleware para verificar el token
const nodemailer = require('nodemailer'); // Para enviar correos

// Crear tarea
router.post('/', verifyToken, async (req, res) => {
  const { title, description, dueDate, priority, invitedEmail } = req.body;
  const ownerId = req.user.id; // Obtener el ID del usuario desde el token

  try {
    // Crear la tarea
    const newTask = await Task.create({ title, description, dueDate, priority, ownerId });
    
    // Buscar si el correo del invitado ya está registrado
    const invitedUser = await User.findOne({ where: { email: invitedEmail } });

    if (invitedUser) {
      // Si el usuario ya está registrado, agregarlo directamente a la tarea
      await newTask.addInvitedUsers([invitedUser.id]);
      res.status(201).json(newTask);
    } else {
      // Si el usuario no está registrado, enviar una invitación por correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const inviteLink = `http://localhost:3000/register?taskId=${newTask.id}&email=${invitedEmail}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: invitedEmail,
        subject: 'Invitación para unirse a una tarea',
        text: `Has sido invitado a una tarea. Por favor, regístrate en este enlace: ${inviteLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ error: 'Error al enviar la invitación por correo' });
        } else {
          console.log('Correo enviado:', info.response);
          res.status(201).json(newTask);
        }
      });
    }
    
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
});

// Obtener tareas del usuario, tanto como propietario como invitado
router.get('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
     // Encontrar todas las tareas donde el usuario es el propietario o ha sido invitado
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId }, // Tareas donde el usuario es el propietario
        ]
      },
      include: [
        { model: User,
          as: 'invitedUsers', // Este es el alias que se usa en la relación belongsToMany
          through: { attributes: [] }, // Omite los atributos de la tabla intermedia en la respuesta
          // where: { id: userId }, // Tareas donde el usuario ha sido invitado
          // required: false // Asegura que las tareas creadas por el usuario también se incluyan
        },
        
      ]
    });

    // Filtrar las tareas donde el usuario es invitado
    const invitedTasks = await Task.findAll({
      include: [{
        model: User,
        as: 'invitedUsers',
        where: { id: userId },
        through: { attributes: [] }
      }]
    });

    // Combinar las tareas de propietario y de invitado
    const allTasks = [...tasks, ...invitedTasks];

    console.log('Tareas obtenidas:', JSON.stringify(allTasks, null, 2));
    
    res.json(allTasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una tarea
router.put('/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, priority, status, newInvitedUsers } = req.body;
  const ownerId = req.user.id; // ID del usuario que realiza la solicitud

  try {
    // Verificar que la tarea exista y que el usuario sea el propietario
    const task = await Task.findOne({ where: { id: taskId, ownerId: ownerId } });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada o no tienes permisos para actualizarla' });
    }

    // Actualizar la tarea con los nuevos datos
    await task.update({ title, description, dueDate, priority, status });

    // Si hay nuevos usuarios invitados, asociarlos a la tarea
    if (newInvitedUsers && newInvitedUsers.length > 0) {
      const usersToInvite = await User.findAll({
        where: {
          id: newInvitedUsers // Buscamos los usuarios por sus IDs
        }
      });

      // Agregar nuevos usuarios invitados a la tarea
      await task.addInvitedUsers(usersToInvite);
      console.log('Nuevos invitados añadidos:', usersToInvite);
    }

    res.json({ message: 'Tarea actualizada exitosamente', task });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una tarea
router.delete('/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const ownerId = req.user.id; // ID del usuario autenticado

  try {
    // Verificar que la tarea exista y que el usuario sea el propietario
    const task = await Task.findOne({ where: { id: taskId, ownerId: ownerId } });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada o no tienes permisos para eliminarla' });
    }

    // Eliminar la tarea
    await task.destroy();

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
