const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
  } catch (error) {
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

module.exports = router;
