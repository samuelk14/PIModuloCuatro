const { Op } = require('sequelize'); // Importa Op desde Sequelize
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // Middleware para verificar el token


// Crear tarea
router.post('/', verifyToken, async (req, res) => {
  const { title, description, dueDate, priority, invitedUsers } = req.body;
  const ownerId = req.user.id; // Obtener el ID del usuario desde el token

  try {
    const newTask = await Task.create({ title, description, dueDate, priority, ownerId });
    // res.status(201).json(newTask);

    // Si hay usuarios invitados, se asocian a la tarea
    if (invitedUsers && invitedUsers.length > 0) {
      const usersToInvite = await User.findAll({
        where: {
          id: invitedUsers // Buscar los usuarios por sus IDs
        }
      });

      console.log('Usuarios a invitar:', usersToInvite);

      // Se usa el método 'addInvitedUsers' que Sequelize genera automáticamente
      await newTask.addInvitedUsers(usersToInvite);
    }

    res.status(201).json(newTask);
    
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

// Otras rutas (actualizar, eliminar) se agregarían aquí.

module.exports = router;
