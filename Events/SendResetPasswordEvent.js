const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const ResetPasswordMailer = require('../Mail/ResetPasswordMailer');
const { currentHost } = require('../Helpers/Utils/Path');

class SendResetPasswordEvent {
	constructor(req, user) {
		this.req = req;
		this.user = user;
	}

	async send() {
		//*generate a token and save it to the database
		const token = await this.#createResetPasswordToken();
		//*send email to the user
		const mailer = new ResetPasswordMailer();
		//*construct verification link
		const verificationLink = this.#createResetPasswordLink(token);
		await mailer.send(this.user.email, 'Reset Password', verificationLink);
	}

	async #createResetPasswordToken() {
		//*generate a token
		const user = this.user;
		const token = await jwt.sign({ id: user.id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '1h' });
		//*save the token to the database
		const userModel = await new UserModel();
		await userModel.update(user.id, {reset_password_token: token});
		return token;
	}

	#createResetPasswordLink(token) {
		return currentHost(this.req) + '/auth/reset-password/verify?token=' + token;
	}
}

module.exports = SendResetPasswordEvent;