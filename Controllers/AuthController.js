const { CustomAPIError } =  require('../Errors');
const ResultValidation = require('../Requests/ResultValidation');
class AuthController{
	//#ANCHOR register
	async register(req, res, next){
		//?return error if the form validation failed
		ResultValidation(req);
		// return res.json('register');
		throw new CustomAPIError('This is a test error');
	}
}

module.exports = AuthController;