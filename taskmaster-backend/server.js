const express = require('express');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { Task, User } = require('./models/associations'); // Importar las asociaciones

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Sincronizar los modelos con la base de datos
sequelize.sync({ force: false }) //cambiar a false para la implementacion 
  .then(() => app.listen(5000, () => console.log('Servidor en ejecución en el puerto 5000')))
  .catch((error) => console.error('Error al sincronizar la base de datos:', error));
