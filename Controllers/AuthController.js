const { ServerError, CustomAPIError, NotFoundError } = require('../Errors');
const ResultValidation = require('../Requests/ResultValidation');
const UserModel = require('../Models/User');
const { CreateAccessToken, CreateRefreshToken } = require('../Helpers/Utils/JWT');
const { LoginResource } = require('../Resources/Auth');
const { SendEmailVerificationEvent, SendResetPasswordEvent } = require('../Events');
const jwt = require('jsonwebtoken');

class AuthController {
	//ANCHOR register
	async register(req, res) {
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { email, password, name } = req.body;
		//?create a new user
		try {
			const user = await new UserModel();
			await user.create({ email, password, name });
			res.status(201).json({ 'message': 'Your Account Created Successfully' });
		}
		catch (err) {
			//?check for email duplication
			if (err.code === '23505') {
				throw new CustomAPIError('This Email is already exists', 409);
			}
			throw new ServerError(err);
		}
	}

	//ANCHOR login
	async login(req, res, next) {
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { email, password } = req.body;
		//*check users credentials	
		const user = await new UserModel();
		//? the authenticate method will throw un authenticated custom error if the credentials are wrong
		const userData = await user.authenticate(email, password);
		//*create refresh token
		const accessToken = CreateAccessToken({ id: userData.id, email: userData.email, name: userData.name });
		//*create access token
		const refreshToken = await CreateRefreshToken({ id: userData.id });
		//*send response to the client with user data and tokens
		LoginResource(req, res, { ...userData, accessToken, refreshToken });
	}

	//ANCHOR logout
	async logout(req, res) {
		//*delete the refresh token from the database
		const user = await new UserModel();
		await user.updateRefreshToken(req.user.id, '');
		//*send response to the client
		res.status(200).json({ 'message': 'Logout Successfully' });
	}

	//ANCHOR Send verification email
	async sendVerificationEmail(req, res) {
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { email } = req.body;
		//find a user by email
		const user = await new UserModel();
		const userData = await user.findUser('email', email);
		//?if user not found
		if (!userData) {
			throw new NotFoundError('User not found');
		}
		//?send verification email
		const emailVerificationEvent = new SendEmailVerificationEvent(req, userData);
		await emailVerificationEvent.send();
		return res.status(200).json({ 'message': 'Verification Email Sent Successfully' });
	}

	//ANCHOR verify email
	async verifyEmail(req, res) {
		//catch the token from the request query params
		const { token } = req.query;
		//?throw error if the token is not provided
		if (!token) {
			throw new CustomAPIError('Token is required', 400);
		}

		//verify the token
		try {
			const user = await new UserModel();
			await user.verifyEmail(token);
			res.render('Mail/verification-message', {
				layout: 'Mail/Layouts/simple',
				title: 'Email Verification Complete',
				header: 'Your Email Is Verified',
				message: 'Your Email Is Verified Successfully Continue To Use Our Services',
			});
		}
		catch (err) {
			console.log(err);
			res.render('Errors/403', {
				layout: 'Errors/Layouts/simple',
				title: 'Invalid Token',
				message: 'This Token was expired please enquire for a new one',
			});
		}
	}

	//SECTION reset password functionality
	//ANCHOR send reset password email
	async sendResetPasswordEmail(req, res) {
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { email } = req.body;
		//find a user by email
		const user = await new UserModel();
		const userData = await user.findUser('email', email);
		//?if user not found
		if (!userData) {
			throw new NotFoundError('User not found');
		}
		//?send reset password email
		const resetPasswordEvent = new SendResetPasswordEvent(req, userData);
		await resetPasswordEvent.send();
		return res.status(200).json({ 'message': 'the reset password link is sent to your email' });
	}
	//ANCHOR verify reset password token and view update password page
	async verifyResetPasswordToken(req, res) {
		//catch the token from the request query params
		const { token } = req.query;
		//?throw error if the token is not provided
		if (!token) {
			throw new CustomAPIError('Token is required', 400);
		}
		//verify the token
		try {
			await jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
			res.render('Pages/update-password', {
				token: token,
				success: false,
				title: 'Reset Password',
				header: 'Add Your New Password',
				button: 'Update Password',
			});
		}
		catch (err) {
			console.log(err);
			res.render('Errors/403', {
				layout: 'Errors/Layouts/simple',
				title: 'Invalid Token',
				message: 'This Token was expired please enquire for a new one',
			});
		}
	}
	//ANCHOR update password
	async updatePassword(req, res) {
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { password, token } = req.body;
		try{
			const userModel = await new UserModel();
			await userModel.updatePassword(token, password);
			res.render('Pages/update-password', {
				success: true,
				title: 'Reset Password',
			});
		}
		catch (err) {
			console.log(err);
			res.render('Errors/403', {
				layout: 'Errors/Layouts/simple',
				title: 'Invalid Token',
				message: 'This Token was expired please enquire for a new one',
			});
		}
	}
	//#!SECTION reset password functionality
}

module.exports = AuthController;