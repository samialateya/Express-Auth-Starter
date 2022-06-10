const { ServerError, CustomAPIError } =  require('../Errors');
const ResultValidation = require('../Requests/ResultValidation');
const UserModel = require('../Models/User');
class AuthController{
	//#ANCHOR register
	async register(req, res, next){
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { email, password, name } = req.body;
		//?create a new user
		try{
			const user = await new UserModel();
			await user.create({ email, password, name });
			res.status(201).json({ 'message': 'Your Account Created Successfully' });
		}
		catch(err){
			//?check for email duplication
			if (err.code === '23505') {
				throw new CustomAPIError('This Email is already exists', 409);
			}
			throw new ServerError(err);
		}
	}
}

module.exports = AuthController;