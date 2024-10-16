const express = require('express');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
const { Task, User } = require('./models/associations'); // Importar las asociaciones

dotenv.config();

const app = express();
app.use(express.json()); // Parsear JSON en las solicitudes

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes); 


const PORT = process.env.PORT || 5000;

let server;

// Solo iniciar el servidor en entornos que no sean de prueba
if (process.env.NODE_ENV !== 'test') { // Para evitar que se ejecute en el entorno de pruebas
    sequelize.sync({ force: false }) // Sincronizar los modelos con la base de datos
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`Servidor en ejecución en el puerto ${PORT}`);
      });
    })
    .catch((error) => console.error('Error al sincronizar la base de datos:', error));
}

// Exportar tanto la app como el servidor para las pruebas
module.exports = { app, server, sequelize };


// Sincronizar los modelos con la base de datos
// sequelize.sync({ force: false }) //cambiar a false para la implementacion 
//   .then(() => app.listen(5000, () => console.log('Servidor en ejecución en el puerto 5000')))
//   .catch((error) => console.error('Error al sincronizar la base de datos:', error));
