import nodemailer from 'nodemailer';
import Config from './config.js';

export const transporter = nodemailer.createTransport({
	host: Config.EMAIL_HOST,
	port: Config.EMAIL_PORT, // port for secure SMTP
	// secure: true, // true for 465, false for other ports
	auth: {
		user: Config.EMAIL_USER, // generated ethereal user
		pass: Config.EMAIL_PASSWORD, // generated ethereal password
	},
	secureConnection: false,
});

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else if (success) {
		console.log(`Server is ready to send email messages`);
	}
});
