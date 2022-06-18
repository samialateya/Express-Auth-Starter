const CustomAPIError = require("./CustomAPIError");

class NotFoundError extends CustomAPIError {
	constructor(message) {
		super(message, 404);
		this.name = "NotFoundError";
	}
}

module.exports = NotFoundError;