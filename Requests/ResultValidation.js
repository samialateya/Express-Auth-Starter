const { validationResult } = require('express-validator');
const {BadRequestError} = require('../Errors');

//*return an error if the form validation failed
const ResultValidation = (req) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		//customize error message
		errors = errors.array().map(error => {
			return {
				field: error.param,
				message: error.msg,
			};
		})
		throw new BadRequestError(JSON.stringify(errors));
	}
	return null;
}


module.exports = ResultValidation;