/* Create New Router */
let router = require('@root/async-router').Router();

/* Importing Controller */
const category = require('./controllers/category');

/* GET, CREATE Categories */
router.route('/categories').get(category.get).post(category.create);

/* PUT, DELETE Categories by ID*/
router
	.route('/categories/:id')
	.all(middlewares.parseId)
	.put(category.update)
	.delete(category.delete);

/* Export Router */
module.exports = router;
