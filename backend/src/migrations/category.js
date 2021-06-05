'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Categories', {
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
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Categories');
	}
};
