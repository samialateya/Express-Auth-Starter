const nodemailer = require('nodemailer');
const ejs = require('ejs');

class VerificationMailer {
	#host = process.env.MAIL_HOST;
	#port = process.env.MAIL_PORT;
	#userName = process.env.MAIL_USERNAME;
	#password = process.env.MAIL_PASSWORD;
	#from = process.env.MAIL_FROM_ADDRESS;

	async send(to, subject, verificationLink) {
		const transporter = nodemailer.createTransport({
			host: this.#host,
			port: this.#port,
			auth: {
				user: this.#userName,
				pass: this.#password,
			},
		});

		const mailBody = await this.#loadTemplate(verificationLink);
		return transporter.sendMail({
			from: this.#from, // sender address
			to: to, // list of receivers
			subject: subject,
			html: mailBody,
		});
	}

	async #loadTemplate(verificationLink) {
		const templateLink = __dirname + '/../Views/Mail/verification-mail.ejs';
		return await ejs.renderFile(templateLink, {
			title: 'Verification Mail',
			header: 'Email Verification',
			message: 'Please click the button below to verify your email address.',
			button: 'Verify Email',
			link: verificationLink
		});
	}
}

module.exports = VerificationMailer;