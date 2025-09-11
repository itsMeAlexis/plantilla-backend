import jwt from 'jsonwebtoken';
import config from './config.js';

const generateToken = ({user:user, expiresIn:expiresIn}) => {
  return jwt.sign(user, config.JWT_SECRET_KEY, {
    expiresIn: expiresIn || '1d'
  });
};

export {
  generateToken
};