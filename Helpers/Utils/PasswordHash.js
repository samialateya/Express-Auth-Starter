const bcrypt = require('bcryptjs');

const PasswordHash = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
}

const PasswordHashMatch = async (password, hash) => {
	return await bcrypt.compare(password, hash);
}

module.exports = {
	PasswordHash,
	PasswordHashMatch
};