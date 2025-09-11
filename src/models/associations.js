// Archivo para manejar todas las asociaciones entre modelos
// Esto evita las referencias circulares

import pd_roles from './pd_roles.model.js';
import pd_paginas from './pd_paginas.model.js';
import pd_roles_paginas from './pd_roles_paginas.model.js';
import pd_usuarios from './pd_usuarios.model.js';

//Asociaciones para pd_usuarios
pd_usuarios.belongsTo(pd_roles, {
  foreignKey: 'id_rol_usuario',
  targetKey: 'id_rol'
});

// Asociaciones para pd_roles
pd_roles.hasMany(pd_usuarios, {
  foreignKey: 'id_rol_usuario',
  sourceKey: 'id_rol'
});
pd_roles.hasMany(pd_roles_paginas, {
  foreignKey: 'id_rol_rp',
  sourceKey: 'id_rol'
});

// Asociaciones para pd_paginas
pd_paginas.hasMany(pd_roles_paginas, {
  foreignKey: 'id_pagina_rp',
  sourceKey: 'id_pagina'
});

// Asociaciones para pd_roles_paginas
pd_roles_paginas.belongsTo(pd_roles, {
  foreignKey: 'id_rol_rp',
  targetKey: 'id_rol'
});

pd_roles_paginas.belongsTo(pd_paginas, {
  foreignKey: 'id_pagina_rp',
  targetKey: 'id_pagina'
});

export {
  pd_usuarios,
  pd_roles,
  pd_paginas,
  pd_roles_paginas,
};
