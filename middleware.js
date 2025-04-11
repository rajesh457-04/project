const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;  
  console.log('Authorization Header:', authHeader);

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Unauthorized: Token missing or malformed');
    return res.status(401).json({ message: 'Unauthorized: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = verifyToken;
