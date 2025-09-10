import { Sequelize } from 'sequelize';
// Importamos la configuración que ya tienes, que carga las variables de entorno.
import config from './config.js';

/**
 * Creación de la instancia de Sequelize.
 * Esta instancia representa la conexión con la base de datos y será reutilizada
 * por todos los modelos de la aplicación.
 */
const sequelize = new Sequelize(
  config.DATABASE_NAME,      // Nombre de la base de datos (ej: 'mi_base_de_datos')
  config.DATABASE_USER,       // Usuario de la base de datos (ej: 'postgres_user')
  config.DATABASE_PASSWORD,   // Contraseña del usuario
  {
    host: config.DATABASE_HOST, // Host donde se encuentra la base de datos (ej: 'localhost' o una IP)
    dialect: 'postgres',  // Le indicamos a Sequelize que estamos usando PostgreSQL

    // Opcional: Desactiva los logs de cada consulta SQL en la consola.
    // Es útil para mantener la consola limpia en producción.
    logging: false,

    // Opcional: Configuración del pool de conexiones, similar a lo que hicimos con 'pg'
    pool: {
      max: 5,   // Máximo de conexiones en el pool
      min: 0,   // Mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo (ms) para intentar obtener una conexión antes de lanzar un error
      idle: 10000     // Tiempo máximo (ms) que una conexión puede estar inactiva antes de ser liberada
    }
  }
);

/**
 * Función para verificar la conexión con la base de datos.
 * Es una buena práctica llamar a esta función al iniciar tu servidor
 * para asegurarte de que la conexión fue exitosa.
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida exitosamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

// Exportamos la instancia para que los modelos puedan importarla y usarla.
export default sequelize;
