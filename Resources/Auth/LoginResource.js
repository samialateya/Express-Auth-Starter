const { currentHost } = require('../../Helpers/Utils/Path');

const LoginResource = (req, res, userData) => {
	res.status(200).json({ 
		'user': {
			'id': userData.id,
			'email': userData.email,
			'name': userData.name,
			'avatar': currentHost(req) + userData.avatar_link,
		}, 
		'accessToken': userData.accessToken, 
		'refreshToken': userData.refreshToken 
	});
}

module.exports = LoginResource;