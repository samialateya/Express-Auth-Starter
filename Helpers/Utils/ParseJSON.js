/**
	@this helper function is used to parse JSON string into JSON object
	if the string is not a valid JSON, it will return the same string back.
	@param {string} jsonString - JSON string or normal string
	@return {object} - JSON object  or String
*/
const ParseJSON = (message) => {
	try{
		return JSON.parse(message);
	}
	catch{
		return message;
	}
}

module.exports = ParseJSON;