const { body } = require('express-validator');

//form fields validation
const UpdateBasicInfoRequest = [
	//name field is required and must be a valid name
	body('name').optional().isString().withMessage('Name is not valid'),
	//update basic info
	body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

module.exports = UpdateBasicInfoRequest;