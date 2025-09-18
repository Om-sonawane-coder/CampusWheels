// server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Header se token lo
  const token = req.header('x-auth-token');

  // Check karo ki token hai ya nahi
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Token ko verify karo
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // User ki ID ko request me daal do
    next(); // Agle step par jaao
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};