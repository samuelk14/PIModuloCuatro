const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const Task = require('./Task');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
  resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
});

// Relación muchos a muchos
//User.belongsToMany(Task, { through: 'TaskInvitations', as: 'invitedTasks' }); // Relación muchos a muchos con tareas invitadas

module.exports = User;
