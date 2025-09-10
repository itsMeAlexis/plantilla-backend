import dotenv from 'dotenv';

dotenv.config();

export default {
	//CORS config
	CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
	//Server config
	SERVER_HOST: process.env.SERVER_HOST || 'localhost',
	SERVER_PORT: process.env.SERVER_PORT || 5500,
	//API config
	API_URL: process.env.API_URL || '/api',
	//Database config
	DATABASE_NAME: process.env.DATABASE_NAME || '',
	DATABASE_USER: process.env.DATABASE_USER || 'XXX',
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'XXX',
	DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
	DATABASE_PORT: process.env.DATABASE_PORT || 5432,
	//nodemailes config
	WEB_URL_PWA: process.env.WEB_URL_PWA || 'Sin URL PWA',
	EMAIL_HOST: process.env.EMAIL_HOST || '',
	EMAIL_PORT: process.env.EMAIL_PORT || '',
	EMAIL_USER: process.env.EMAIL_USER || '',
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
	//JWT config
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'YOUR_SECRET_KEY',
	tls: process.env.tls || false,
	tlsCAFile: process.env.tlsCAFile || '', // Asegura que esta ruta es válida
};

