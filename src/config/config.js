import dotenv from 'dotenv';

dotenv.config();

export default {
	API_URL: process.env.API_URL || '/api',
	HOST: process.env.HOST || 'localhost',
	DB_PORT: process.env.PORT || 5432,
	JWT_SECRET: process.env.JWT_SECRET || 'secret',
	CONNECTION_STRING: process.env.CONNECTION_STRING || '',
	DATABASE: process.env.DATABASE || '',
	DB_USER: process.env.DB_USER || 'XXX',
	DB_PASSWORD: process.env.DB_PASSWORD || 'XXX',
	CLUSTER: process.env.CLUSTER || 'XXX',
	WEB_URL_PWA: process.env.WEB_URL_PWA || 'Sin URL PWA',
	EMAIL_USER: process.env.EMAIL_USER || '',
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
	EMAIL_HOST: process.env.EMAIL_HOST || '',
	EMAIL_PORT: process.env.EMAIL_PORT || '',
	tls: process.env.tls || false,
	tlsCAFile: process.env.tlsCAFile || '', // Asegura que esta ruta es válida
};

