import jwt from 'jsonwebtoken';
import config from './config.js';

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, rol: user.rol }, config.JWT_SECRET_KEY, {
    expiresIn: '1d'
  });
};

//export default { generateToken };
