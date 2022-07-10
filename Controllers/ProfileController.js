const { ProfileResource } = require('../Resources/Profile');
const UserModel = require('../Models/User');
const { PasswordHash } = require('../Helpers/Utils/PasswordHash');
const ResultValidation = require('../Requests/ResultValidation');


class ProfileController{

	//*fetch profile info
	async getProfile(req, res){
		//fetch full user data from the database
		const user = await new UserModel();
		const userData = await user.findUser('id', req.user.id);

		//return user profile resource as a response
		return ProfileResource(req, res, userData);
	}

	//*update basic info
	async updateBasicInfo(req, res){
		//?return error if the form validation failed
		ResultValidation(req);
		//data to updated //*add data when the user appended it in the request
		const data = {};
		//?append the name if exists
		req.body.name ? data.name = req.body.name : '';
		//?append the password if exists
		req.body.password ? data.password = await PasswordHash(req.body.password) : '';
		//?if no data to update throw an error
		if (Object.keys(data).length === 0) 
			return res.status(400).json({ message: 'No data to update' });
		//catch user model
		const user = await new UserModel();
		//update user basic info
		await user.update(req.user.id, data);
		//return success response to user
		return res.status(200).json({ 'message': 'Profile Updated Successfully' });
	}

	//*update avatar
	async updateAvatar(req, res){
		//?return error if the form validation failed
		ResultValidation(req);
		upload(req, res, (err) => {
			if (err) {
				res.status(400).send("Something went wrong!");
			}
			res.send(req.file);
		});
		return res.status(200).json({ 'message': 'Profile Updated Successfully' });
	}
}

module.exports = ProfileController;