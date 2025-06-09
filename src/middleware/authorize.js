const authorize = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' });
      }
  
      if (roles.length && !roles.includes(req.user.rol)) {
        return res.status(403).json({ message: 'No tiene permiso para acceder a esta ruta' });
      }
  
      next();
    };
  };
  
  export default authorize;
  