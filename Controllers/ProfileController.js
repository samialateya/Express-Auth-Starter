const { ProfileResource } = require('../Resources/Profile');
const UserModel = require('../Models/User');

class ProfileController{
	async getProfile(req, res){
		//*fetch full user data from the database
		const user = await new UserModel();
		const userData = await user.findUser('id', req.user.id);

		//return user profile resource as a response
		return ProfileResource(req, res, userData);
	}
}

module.exports = ProfileController;