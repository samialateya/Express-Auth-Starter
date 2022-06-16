const { body } = require('express-validator');

//form field validation

const RegisterRequest = [
	//name field is required
	body('name').exists().withMessage('Name is required'),
	//email field is required and must be a valid email
	body('email').exists().isEmail().withMessage('Email is not valid'),
	//password field is required and must be at least 6 characters long
	body('password').exists().isLength({ min: 6 }).withMessage('Password must be at least 8 characters long'),
	//passwordConfirmation field is required and must match password
	body('password_confirmation').exists().custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Password confirmation must match password');
		}
		return true;
	}),
];

module.exports = RegisterRequest;