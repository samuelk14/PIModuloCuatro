const request = require('supertest');
const { app, sequelize } = require('../server'); // Asegúrate de que está exportado en server.js
const User = require('../models/User'); 

describe('Pruebas para la ruta de recuperación de contraseña', () => {

  // Antes de todas las pruebas, se sincroniza la base de datos y se crea un usuario de prueba
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Resetea la base de datos
    // Crear un usuario de prueba
    await User.create({
      name: 'Usuario de Prueba',
      email: 'usuario@example.com',
      password: 'password123%'
    });
  });

  // Después de todas las pruebas, se cierra la conexión de la base de datos
  afterAll(async () => {
    await sequelize.close(); // Cerrar la conexión con la base de datos
  });

  // Prueba para la ruta POST /auth/forgot-password
  it('Debe retornar un error si el correo no tiene un formato válido', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'correo_invalido' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('El correo electrónico debe tener un formato válido');
  });

  // Prueba para un correo válido
  it('Debe retornar un éxito si el correo tiene un formato válido', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'usuario@example.com' });

    expect(response.statusCode).toBe(200); // Asume que el correo es válido y el usuario existe
  });
});
