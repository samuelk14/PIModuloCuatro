const { Op } = require('sequelize');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const crypto = require('crypto'); // Para generar tokens aleatorios
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const { registerSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validations'); //Para validaciones de contraseña

// Registro de usuario
router.post('/register', async (req, res) => {
  // Validar los datos de entrada usando Joi
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, password } = req.body;
  const { taskId } = req.query; // Obtener el taskId desde los parámetros de la URL

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el nuevo usuario
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    // Si el usuario fue invitado a una tarea (taskId existe en la URL)
    if (taskId) {
      const task = await Task.findByPk(taskId); // Buscar la tarea
      if (task) {
        await task.addInvitedUsers([newUser.id]); // Asociar la tarea al nuevo usuario
      }
    }

    // Responder con éxito
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
  } catch (error) {
    // Manejo de errores
    res.status(400).json({ error: error.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar un token de recuperación de contraseña
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Establecer la expiración del token (ej. 1 hora desde ahora)
    const tokenExpiration = Date.now() + 3600000; // 1 hora

    // Guardar el token y la expiración en el usuario
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // Configurar el transporte para enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Usa tu servicio de correo preferido
      auth: {
        user: process.env.EMAIL_USER, // Correo desde el que enviarás
        pass: process.env.EMAIL_PASS, // Contraseña o App password
      }
    });

    // Configurar el contenido del correo
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Recuperación de Contraseña',
      text: `Has solicitado una recuperación de contraseña. Haz clic en el siguiente enlace o pégalo en tu navegador para restablecer tu contraseña: \n\n
        http://${req.headers.host}/api/auth/reset-password/${resetToken} \n\n
        Si no solicitaste esta acción, ignora este correo.`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Correo de recuperación enviado con éxito' });
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
  }
});

// Restablecer contraseña
router.post('/reset-password/:token', async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { token } = req.params;
  const { password } = req.body;

  try {
    // Buscar al usuario por el token de recuperación
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() } // El token no debe haber expirado
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'El token no es válido o ha expirado' });
    }

    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(password, 10); // Asegúrate de usar bcrypt para encriptar
    user.resetPasswordToken = null; // Limpiar el token de recuperación
    user.resetPasswordExpires = null; // Limpiar la expiración

    await user.save();

    res.json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;
