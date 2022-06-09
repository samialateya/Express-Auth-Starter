const { CustomAPIError } =  require('../Errors');
class AuthController{
	//#ANCHOR register
	async register(req, res, next){
		throw new CustomAPIError('This is a test error');
	}
}

module.exports = AuthController;