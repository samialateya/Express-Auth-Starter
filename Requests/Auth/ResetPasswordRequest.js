const {body} = require('express-validator');

//form fields validation
const LoginRequest = [
	//token is required
	body('token').not().isEmpty().withMessage('Token is required'),
	//password field is required and must be at least 6 characters long
	body('password').exists().isLength({ min: 6 }).withMessage('Password must be at least 8 characters long'),
	//passwordConfirmation field is required and must match password
	body('password_confirmation').exists().custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Password confirmation must match password');
		}
		return true;
	})
];

module.exports = LoginRequest;