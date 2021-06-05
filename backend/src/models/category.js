/* Import Deps */
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

/* DB Object */
const db = require('../config/database');

/* Define Category Model */
const Category = db.define(
	'Category',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		parentId: {
			type: DataTypes.INTEGER
		}
	},
	{
		tableName: 'Categories',
		timestamps: false
	}
);

/* Exports */
module.exports = Category;
