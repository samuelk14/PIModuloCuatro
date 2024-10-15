const Joi = require('joi');

// Validación de la recuperación de contraseña
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico debe tener un formato válido',
    'string.empty': 'El correo electrónico es requerido'
  })
});

// Validación para actualizar el perfil
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'El correo electrónico debe tener un formato válido'
  }),
  newPassword: Joi.string().min(8).pattern(/^[a-zA-Z0-9!@#$%^&*]{8,}$/).optional().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.pattern.base': 'La contraseña debe contener letras, números y caracteres especiales'
  }),
  confirmPassword: Joi.ref('newPassword') // Debe coincidir con newPassword
});

// Validación para restablecer la contraseña
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).pattern(/^[a-zA-Z0-9!@#$%^&*]{8,}$/).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.pattern.base': 'La contraseña debe contener letras, números y caracteres especiales'
  })
});

module.exports = {
  forgotPasswordSchema,
  updateProfileSchema,
  resetPasswordSchema
};
