const { ServerError, CustomAPIError } =  require('../Errors');
const ResultValidation = require('../Requests/ResultValidation');
const UserModel = require('../Models/User');
const { CreateAccessToken, CreateRefreshToken } = require('../Helpers/Utils/JWT');
const { LoginResource } = require('../Resources/Auth');

class AuthController{
	//#ANCHOR register
	async register(req, res){
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

	//#ANCHOR login
	async login(req, res, next){
		//?return error if the form validation failed
		ResultValidation(req);
		//catch request data
		const { email, password } = req.body;
		//*check users credentials	
		const user = await new UserModel();
		//? the authenticate method will throw un authenticated custom error if the credentials are wrong
		const userData = await user.authenticate(email, password);
		//*create refresh token
		const accessToken = CreateAccessToken({id: userData.id, email: userData.email, name: userData.name});
		//*create access token
		const refreshToken = await CreateRefreshToken({id: userData.id});
		//*send response to the client with user data and tokens
		LoginResource(res, { ...userData, accessToken, refreshToken });
	}
}

module.exports = AuthController;