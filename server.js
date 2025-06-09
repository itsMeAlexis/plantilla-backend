import app from './app.js';
import config from './src/config/config.js';

app.listen(app.get('port'));
console.log(
  `Server is running on: http://${config.HOST}:${app.get('port')}${
    config.API_URL
  }`
);

//testear conexión a la base de datos
import { testConnection } from './src/config/database.js';
testConnection();
