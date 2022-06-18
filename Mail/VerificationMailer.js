const nodemailer = require('nodemailer');

class VerificationMailer {
	#host = process.env.MAIL_HOST;
	#port = process.env.MAIL_PORT;
	#userName = process.env.MAIL_USERNAME;
	#password = process.env.MAIL_PASSWORD;
	#from = process.env.MAIL_FROM_ADDRESS;

	async send(to, subject, body) {
		const transporter = nodemailer.createTransport({
			host: this.#host,
			port: this.#port,
			auth: {
				user: this.#userName,
				pass: this.#password,
			},
		});

		return transporter.sendMail({
			from: this.#from, // sender address
			to: to, // list of receivers
			subject: subject,
			html: body,
		});
	}
}

module.exports = VerificationMailer;