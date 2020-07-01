/**
 * Library To Connect Application To MongoDB Database.
 */

import mongoose from 'mongoose';
import mongooseMergePlugin from 'mongoose-merge-plugin';
import Promise from 'bluebird';
import logger from './logger';
import mongooseTimestampPlugin from './mongoose-timestamp';

// set mongoose promise to bluebirds
mongoose.Promise = Promise;
mongoose.plugin(mongooseMergePlugin);
mongoose.plugin(mongooseTimestampPlugin.timestampPlugin);

/**
 * Determine the connection status.
 * @type {boolean}
 */
let connecting = false;

/**
 * Initiate Connection Between Application And MongoDB
 * @param {Object} options  MongoDB Configuration Options.
 * @return {Promise}
 */
function connect(options) {
	return new Promise((resolve, reject) => {
		if (connecting) {
			return resolve();
		}

		connecting = true;

		const mongooseConnection = mongoose.connection;

		mongooseConnection.on('error', err => {
			logger.error('Mongoose Connection Failure');
			reject(err);
		});

		mongooseConnection.on('connected', () => resolve());

		mongoose.connect(
			options.URI,
			options.OPTIONS
		);
	});
}

/**
 * Terminate MongoDB Connection
 */
function close() {
	mongoose.connection.close(() => {
		logger.debug('Mongoose connection closed');
	});
}

export { connect, close };
