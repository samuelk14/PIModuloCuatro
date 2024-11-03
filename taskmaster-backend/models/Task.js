const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const User = require('./User');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  priority: { type: DataTypes.ENUM('alta', 'media', 'baja'), defaultValue: 'media' },
  status: { type: DataTypes.ENUM('pendiente', 'en progreso', 'completada'), defaultValue: 'pendiente' },
  comentarios: { type: DataTypes.TEXT, allowNull: true },
  isPinned: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Definir relaciones
// Task.belongsTo(User, { as: 'owner' }); // Una tarea pertenece a un propietario
// Task.belongsToMany(User, { through: 'TaskInvitations', as: 'invitedUsers' }); // Relación muchos a muchos con los usuarios invitados

module.exports = Task;
