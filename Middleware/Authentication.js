const { CustomAPIError } = require("../Errors");
const jwt = require('jsonwebtoken');

const UserAuth = async (req, res, next) => {
	//?check if the request has a bearer token
	if (!req.headers.authorization) {
		throw new CustomAPIError('Un Authenticated Request', 401)
	}

	//get the token from the request
	const token = req.headers.authorization.split(' ')[1];

	//verify the token
	try{
		const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		//set the user data to the request
		req.user = user;
		//continue to the next middleware
		next();
	}
	catch(err){
		throw new CustomAPIError('Invalid token', 401)
	}
	

}

module.exports = {
	UserAuth
};