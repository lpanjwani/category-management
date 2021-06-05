/* Validate & Parse Category IDs */
exports.parseId = function (req, res, next) {
	// Parse ID to Integer
	let id = parseInt(req.params.id);

	// Check for INvalid Number
	if (!Number.isNaN(id) && Number.isFinite(parseInt(id))) {
		// Update Params with Parsed ID
		req.params.id = id;

		// Progress to Next Middlewares
		next();
	} else {
		// Throw 400 Error
		res.status(400).send({
			message: 'Invalid ID'
		});
	}
};
