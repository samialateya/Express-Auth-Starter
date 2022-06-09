const NotFoundMiddleware = (req, res, next) => {
	return res.status(404).json({error: "Un Registered Route"});
}

module.exports = NotFoundMiddleware;