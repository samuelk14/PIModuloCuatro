const Joi = require("joi");

// Expresión regular para validar que la contraseña contenga letras, números y caracteres especiales
const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// Esquema para registrar usuario
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no debe exceder los 30 caracteres",
    "string.empty": "El nombre es requerido",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El correo electrónico debe tener un formato válido",
    "string.empty": "El correo electrónico es requerido",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "La contraseña debe tener al menos 8 caracteres, e incluir al menos una letra, un número y un carácter especial",
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Las contraseñas deben coincidir",
  }),
});

// Validación de la recuperación de contraseña
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El correo electrónico debe tener un formato válido",
    "string.empty": "El correo electrónico es requerido",
  }),
});

// Validación para actualizar el perfil
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "El correo electrónico debe tener un formato válido",
  }),
  currentPassword: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida'
  }),
  newPassword: Joi.string().pattern(passwordPattern).optional().messages({
    "string.pattern.base":
      "La contraseña debe tener al menos 8 caracteres, e incluir al menos una letra, un número y un carácter especial",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).optional().messages({
    "any.only": "Las contraseñas deben coincidir",
  }), // Debe coincidir con newPassword
});

// Validación para restablecer la contraseña
const resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base":
      "La contraseña debe tener al menos 8 caracteres, e incluir al menos una letra, un número y un carácter especial",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Las contraseñas deben coincidir",
  }),
});

module.exports = {
  registerSchema,
  forgotPasswordSchema,
  updateProfileSchema,
  resetPasswordSchema,
};
