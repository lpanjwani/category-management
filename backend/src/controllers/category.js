/* Models */
const Category = require('../models/category');

/* Utils */
const utils = require('../utils');

/* GET Controller */
exports.get = async (req, res) => {
	// Fetch All Categories from DB
	Category.findAll({
		attributes: ['id', 'name', 'parentId'], // Fetch ID, Name & ParentID Only
		order: [['id', 'ASC']] // Order By ID ASC
	})
		.then(categories => {
			// Convert to Tree View
			const tree = utils.toTreeView(categories);

			// Send 200 Response
			res.status(200).send(tree);
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

	// Check for Missing Name
	if (!category.name) {
		// Throw 400 Error
		res.status(400).send({
			message: 'Missing Name'
		});

		// Finish Execution
		return false;
	}

	// Check for ParentId
	if (category.parentId) {
		// Fetch Parent from DB
		const parent = await Category.findByPk(category.parentId);

		// Check is Parent ID is Invalid
		if (!parent) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Invalid Parent Category'
			});

			// Finish Execution
			return false;
		}

		// Check for Parent Name & Category Name is Same/Match
		if (parent.name === category.name) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Duplicate Category'
			});

			// Finish Execution
			return false;
		}

		// Fetch Siblings from the Same Parent
		const siblings = await Category.findAll({
			where: { parentId: category.parentId }
		});

		// Check for Same Name
		if (siblings.some(sibling => sibling.name === category.name)) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Duplicate Category'
			});

			// Finish Execution
			return false;
		}
	} else {
		// Fetch All Parent Categories
		const root = await Category.findAll({
			where: { parentId: null }
		});

		// Check for Same Name
		if (root.some(item => item.name === category.name)) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Duplicate Category'
			});

			// Finish Execution
			return false;
		}
	}

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

	// Init Empty DB Object
	const category = {};

	// Check for Name in Request Body
	if (body.name) {
		// Add Name to DB Object
		category.name = body.name;
	}

	// Check for Parent ID in Request Body
	if (body.parentId) {
		// Add Name to DB Object
		category.parentId = body.parentId;
	}

	// Check for Missing Name AND Parent ID
	if (!category.name && !category.parentId) {
		// Throw 400 Error
		res.status(400).send({
			message: 'Missing Update Information'
		});

		// Finish Execution
		return false;
	}

	// Fetch Category from DB
	const dbCategory = await Category.findByPk(id);

	// Check for No Existing Category
	if (!dbCategory) {
		// Throw 400 Error
		res.status(400).send({
			message: 'Cannot Update Category. Verify Category ID!'
		});

		// Finish Execution
		return false;
	}

	// Check for Parent Category being moved to Child
	if (!dbCategory.parentId && category.parentId) {
		// Throw 400 Error
		res.status(400).send({
			message: 'Parent Category Cannot Be Moved To Child Category'
		});

		// Finish Execution
		return false;
	}

	// Check if operation involves a Destination Parent Category
	if (category.parentId) {
		// Fetch Destination Parent Category
		const parent = await Category.findByPk(category.parentId);

		// Check If Destination Parent Category Exists
		if (!parent) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Missing Parent Category'
			});

			// Finish Execution
			return false;
		}

		// Check If Destination Parent is Duplicate
		if (parent.name === category.name) {
			res.status(400).send({
				message: 'Duplicate Category'
			});

			// Finish Execution
			return false;
		}

		// Fetch Sibling Categories
		const siblings = await Category.findAll({
			where: { parentId: category.parentId }
		});

		// Check for Same Name
		if (siblings.some(sibling => sibling.name === category.name)) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Duplicate Category'
			});

			// Finish Execution
			return false;
		}
	} else {
		// Fetch All Parent Categories
		const root = await Category.findAll({
			where: { parentId: null }
		});

		// Check for Same Name
		if (root.some(item => item.name === category.name)) {
			// Throw 400 Error
			res.status(400).send({
				message: 'Duplicate Category'
			});

			// Finish Execution
			return false;
		}
	}

	// Update Category
	Category.update(category, {
		where: { id: id }
	})
		.then(async num => {
			// Check for Sucessfull Update
			if (num == 1) {
				// Update Response to Return
				await dbCategory.reload();

				// Send 200 Response
				res.send({
					message: 'Category was updated successfully.',
					...dbCategory.toJSON()
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

	// Check for Missing ID
	if (!id) {
		// Throw 400 Error
		res.status(400).send({
			message: 'Missing ID'
		});
	}

	// Fetch Children Categories
	const children = await Category.findAll({
		where: { parentId: id }
	});

	// Check for No Children Categories
	if (children.length > 0) {
		// Throw 400 Error
		res.status(400).send({
			message: 'Please Delete Child Categories First'
		});

		// Finish Execution
		return false;
	}

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
