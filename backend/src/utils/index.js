/* Convert to Tree View */
exports.toTreeView = categories => {
	// Init Tree Array
	const tree = [];

	// Init Mapping ChildOf
	const childOf = {};

	// Iterate over Categories
	categories.forEach(item => {
		// Descture Variables
		const { id, parentId } = item;
		// Init New childOf Array If Not Exists
		childOf[id] = childOf[id] || [];

		// Assign Children to New Object
		const newItem = Object.assign(
			item.get({
				plain: true
			}),
			{
				children: childOf[id]
			}
		);

		// Conditionall Add Children to Array
		parentId ? (childOf[parentId] = childOf[parentId] || []).push(newItem) : tree.push(newItem);
	});

	return tree;
};
