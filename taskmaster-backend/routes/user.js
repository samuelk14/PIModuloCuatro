const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { updateProfileSchema } = require("../middleware/validations");

// Obtener el perfil del usuario
router.get("/profile", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscar al usuario por su ID
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "name", "email", "createdAt", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

// Actualizar el perfil del usuario
router.put("/profile", verifyToken, async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const userId = req.user.id; // ID del usuario autenticado
  const { name, email, currentPassword, newPassword, confirmPassword } =
    req.body; // Datos del perfil a actualizar

  try {
    // Buscar al usuario por su ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar los campos del perfil según los datos enviados
    user.name = name || user.name;
    user.email = email || user.email;

    // Verificar si se quiere cambiar la contraseña
    if (currentPassword && newPassword) {
      // Verificar que la contraseña actual sea correcta
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "La contraseña actual es incorrecta" });
      }

      // Verificar que newPassword y confirmPassword coincidan
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
      }

      // Encriptar la nueva contraseña y actualizarla
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({ message: "Perfil actualizado con éxito", user });
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
});

module.exports = router;
