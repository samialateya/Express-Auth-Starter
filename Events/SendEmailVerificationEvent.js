const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const VerificationMailer = require('../Mail/VerificationMailer');

class SendEmailVerificationEvent {
	constructor(user) {
		this.user = user;
	}

	async send(user) {
		//*generate a token and save it to the database
		const token = await this.#createVerificationToken(user);
		//*send email to the user
		const mailer = new VerificationMailer();
		await mailer.send(user.email, 'Verify your email', `<a href="${process.env.APP_URL}/verify?token=${token}">Verify your email</a>`);
	}

	async #createVerificationToken(user) {
		//*generate a token
		const token = await jwt.sign({ id: user.id }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '1h' });
		//*save the token to the database
		const userModel = await new UserModel();
		await userModel.updateVerificationToken(user.id, token);
		return token;
	}
}

module.exports = SendEmailVerificationEvent;