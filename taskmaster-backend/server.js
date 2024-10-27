const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
const { Task, User } = require('./models/associations'); // Importar las asociaciones

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parsear JSON en las solicitudes

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes); 


const PORT = process.env.PORT || 5000;

let server;

// Solo iniciar el servidor en entornos que no sean de prueba
if (process.env.NODE_ENV !== 'test') { // Para evitar que se ejecute en el entorno de pruebas
    sequelize.sync({ alter: true }) // Actualiza la estructura de la base de datos sin borrar datos
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`Servidor en ejecución en el puerto ${PORT}`);
      });
    })
    .catch((error) => console.error('Error al sincronizar la base de datos:', error));
}

// Exportar tanto la app como el servidor para las pruebas
module.exports = { app, server, sequelize };