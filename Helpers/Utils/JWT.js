const jwt = require('jsonwebtoken');
const UserModel = require('../../Models/User');
const CreateAccessToken = (userData) => {
	//* create the access token
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
	const accessToken = jwt.sign(userData, accessTokenSecret, { expiresIn: '1h' });
	return accessToken;
}

const CreateRefreshToken = async (userData) => {
	//* create the refresh token
	const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
	const refreshToken = jwt.sign(userData, refreshTokenSecret, { expiresIn: '100d' });
	//* save the refresh token in the database
	const userModel = await new UserModel();
	await userModel.update(userData.id, {refresh_token: refreshToken});
	return refreshToken;
}

module.exports = {
	CreateAccessToken,
	CreateRefreshToken
}