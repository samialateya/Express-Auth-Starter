const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const VerificationMailer = require('../Mail/VerificationMailer');
const { currentHost } = require('../Helpers/Utils/Path');
class SendEmailVerificationEvent {
	constructor(req, user) {
		this.req = req;
		this.user = user;
	}

	async send() {
		//*generate a token and save it to the database
		const token = await this.#createVerificationToken();
		//*send email to the user
		const mailer = new VerificationMailer();
		//*construct verification link
		const verificationLink = this.#createVerificationLink(token);
		await mailer.send(this.user.email, 'Verify your email', verificationLink);
	}

	async #createVerificationToken() {
		//*generate a token
		const user = this.user;
		const token = await jwt.sign({ id: user.id }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '1h' });
		//*save the token to the database
		const userModel = await new UserModel();
		await userModel.updateVerificationToken(user.id, token);
		return token;
	}

	#createVerificationLink(token) {
		return currentHost(this.req) + '/auth/email-verification/verify?token=' + token;
	}
}

module.exports = SendEmailVerificationEvent;