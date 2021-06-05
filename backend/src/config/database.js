/* Import Deps */
const { Sequelize } = require('sequelize');

/* Environment Variables */
const HOST = process.env.DB_HOST;
const DATABASE = process.env.DB_DATABASE;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

/* Environment Variables Checker */
if (!HOST || !DATABASE || !USERNAME || !PASSWORD) {
	throw new Error('Missing Database Credentials');
}

// Passing a Connection URI for MYSQL
const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
	host: HOST,
	dialect: 'mysql',
	logging: false
});

// Connnect Function
(async () => {
	try {
		// Authenticate
		await sequelize.authenticate();
		// Sync Models with DB
		await sequelize.sync();

		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);

		throw error;
	}
})();

// Export Function
module.exports = sequelize;
