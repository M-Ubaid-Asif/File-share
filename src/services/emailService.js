import nodemailer from 'nodemailer'
import logger from '../config/logger.js'

const sendMail = async ({ from, to, subject, text, html }) => {
	logger.info('inside mail service')
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD,
		},
	})

	const info = await transporter.sendMail({
		from,
		to,
		subject,
		text,
		html,
	})
	console.log(info)
}

export default sendMail
