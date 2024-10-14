const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

  if (!token) {
    return res.status(403).send('Se requiere un token para esta operación');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token no válido');
    }
    req.user = decoded; // Guardar el ID del usuario en la solicitud
    next(); // Pasar al siguiente middleware o ruta
  });
};

module.exports = { verifyToken };
