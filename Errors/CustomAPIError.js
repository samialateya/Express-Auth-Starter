class CustomAPIError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = 'CustomAPIError';
		this.statusCode = statusCode;
	}
}

module.exports = CustomAPIError;