// import passport from 'passport';

// const authenticate = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) return next(err);
//     if (!user) return res.status(401).json({ message: 'No autorizado' });
//     req.user = user;
//     next();
//   })(req, res, next);
// };

// export default authenticate;

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del encabezado
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    jwt.verify(token, config.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};
export default authenticate;