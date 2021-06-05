// Configure Environment Variables
require('dotenv').config();

/* Import Deps */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Initialize Express Instance
const app = express();

// Database Connector
const database = require('./src/config/database');

// Routes File Locator
const routes = require('./src/routes');

/* Express Middlewares */
// JSON Parser
app.use(express.json());

// Helmet Security Headers
app.use(helmet());

// Enable CORS
app.use(cors());

/* Routing Middlewares */
app.use('/v1', routes);

/* Error Handling Middleware */
app.use(function (err, req, res, next) {
	console.log(err);
	res.status(err.status || 500).json({
		message: 'An error has occurred or an incorrect call has been made the Styli Server'
	});
});

/* Server PORT Listener */
if (process.env.NODE_ENV !== 'test') {
	const PORT = 3001;
	app.listen(PORT, () => {
		console.log(`Styli Server Listening at ${PORT}`);
	});
}
