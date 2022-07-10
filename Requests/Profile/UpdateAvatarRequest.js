const { body } = require('express-validator');

//form fields validation
const UpdateAvatarRequest = [
	//validate avatar image
	body('avatar').custom((value, { req }) => {
		if (req.file) {
			return avatarValidator(req.file);
		}
		return false;
	}).withMessage('Avatar must be a valid image')
];

//avatar validator
const avatarValidator = (file) => {
	//?check file size
	if (file.size > 1000000) return false;
	//?check file type
	const fileType = file.mimetype.split('/')[1];
	if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') return false;
	//?return true if all checks pass
	return true;
}

module.exports = UpdateAvatarRequest;