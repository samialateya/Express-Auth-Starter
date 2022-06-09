const { CustomAPIError } = require('../Errors');
const { ParseJSON } = require('../Helpers/Utils');

const ErrorHandlerMiddleware = (err, req, res, next) => {
	console.log(err);
	if(err instanceof CustomAPIError){
		return res.status(err.statusCode || 500).json({ "error": ParseJSON(err.message)});
	}
	return res.status(500).json({error : 'Server Error'});
}

module.exports = ErrorHandlerMiddleware;