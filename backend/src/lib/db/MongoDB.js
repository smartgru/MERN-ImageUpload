// eslint-disable-next-line no-unused-vars
import { MongoClient, Db } from 'mongodb';
import CONFIG from '../../conf';
import logger from '../logger';

let mongoClient = null;

/**
 * Establish connection to database.
 * @returns {Db}
 */
async function connect() {
	if (!mongoClient) {
		mongoClient = await MongoClient.connect(
			CONFIG.MONGO.URI,
			CONFIG.MONGO.OPTIONS
		);

		logger.info('Connecting to MongoClient');
	}

	return mongoClient.db();
}

/**
 * Close established connection to MongoDB.
 */
function close() {
	if (mongoClient) {
		mongoClient.close();
		logger.info('MongoClient connection disconnected.');
	}
}

export default {
	connect,
	close,
};
