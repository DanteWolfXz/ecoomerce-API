// verifyAuth.mjs

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/verify', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó ningún token de autorización' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Token de autorización inválido' });
  }
});

export default router;
