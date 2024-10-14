const Task = require('./Task');
const User = require('./User');

// Establece la relación muchos a muchos entre Task y User
Task.belongsTo(User, { as: 'owner' }); // Relación uno a muchos: Task tiene un owner
Task.belongsToMany(User, { through: 'TaskInvitations', as: 'invitedUsers' }); // Muchos a muchos para invitados

User.belongsToMany(Task, { through: 'TaskInvitations', as: 'invitedTasks' }); // Definir desde el lado de User también

module.exports = { Task, User }; // Exportar los modelos con las asociaciones
