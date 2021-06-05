/* Models */
const Category = require('../models/category');

/* GET Controller */
exports.get = async (req, res) => {
	// Fetch All Categories from DB
	Category.findAll({
		attributes: ['id', 'name', 'parentId'], // Fetch ID, Name & ParentID Only
		order: [['id', 'ASC']] // Order By ID ASC
	})
		.then(categories => {
			// Send 200 Response
			res.status(200).send(categories);
		})
		.catch(err => {
			// Print Error for Debugging
			console.error(err);

			// Send 500 Error
			res.status(500).send({
				message: 'Some Error Occurred While Retrieving Categories'
			});
		});
};

/* POST Create Controller */
exports.create = async (req, res) => {
	// Access Body
	const body = req.body;

	// Convert to Database Object
	const category = {
		name: body.name,
		parentId: body.parentId
	};

	// Create Category
	Category.create(category)
		.then(data => {
			// Send 200 Response
			res.status(202).send(data);
		})
		.catch(err => {
			// Print Error for Debugging
			console.error(err);

			// Send 500 Response
			res.status(500).send({
				message: err.message || 'Some Error Occurred While Creating Category'
			});
		});
};

/* PUT Update Controller */
exports.update = async (req, res) => {
	// Access Category ID
	const id = req.params.id;

	// Access Body
	const body = req.body;

	// Convert to Database Object
	const category = {
		name: body.name,
		parentId: body.parentId
	};

	// Update Category
	Category.update(category, {
		where: { id: id }
	})
		.then(async num => {
			// Check for Sucessfull Update
			if (num == 1) {
				// Send 200 Response
				res.send({
					message: 'Category was updated successfully.'
				});
			} else {
				// Send 400 Response
				res.status(400).send({
					message: 'Cannot Update Category. Verify Information'
				});
			}
		})
		.catch(err => {
			// Print Error for Debugging
			console.error(err);

			// Send 500 Response
			res.status(500).send({
				message: 'Error updating Category'
			});
		});
};

/* DELETE Controller */
exports.delete = async (req, res) => {
	// Access Category ID
	const id = req.params.id;

	// Delete Category
	Category.destroy({
		where: { id: id }
	})
		.then(num => {
			// Check for Sucessfull Delete
			if (num == 1) {
				// Send 200 Response
				res.send({
					id: id,
					message: 'Category Deleted Successfully!'
				});
			} else {
				// Send 400 Response
				res.status(400).send({
					message: 'Cannot Update Category. Verify Category ID!'
				});
			}
		})
		.catch(err => {
			// Print Error for Debugging
			console.error(err);

			// Send 500 Response
			res.status(500).send({
				message: 'Error Deleting Category'
			});
		});
};
