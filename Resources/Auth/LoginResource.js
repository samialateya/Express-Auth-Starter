const LoginResource = (res, userData) => {
	res.status(200).json({ 
		'user': {
			'id': userData.id,
			'email': userData.email,
			'name': userData.name,
		}, 
		'accessToken': userData.accessToken, 
		'refreshToken': userData.refreshToken 
	});
}

module.exports = LoginResource;