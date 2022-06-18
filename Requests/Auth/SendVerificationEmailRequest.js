const { body } = require('express-validator');

//form fields validation
const SendVerificationEmailRequest = [
	//email field is required and must be a valid email
	body('email').exists().isEmail().withMessage('Email is not valid'),
];

module.exports = SendVerificationEmailRequest;