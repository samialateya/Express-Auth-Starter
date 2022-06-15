const {body} = require('express-validator');

//form fields validation
const LoginRequest = [
	//email field is required and must be a valid email
	body('email').exists().isEmail().withMessage('Email is not valid'),
	//password field is required and must be at least 6 characters long
	body('password').exists().isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
];

module.exports = LoginRequest;