import * as db from './db';
import logger from './logger';

function gracefulShutdown(server) {
	let shutdownInProgress = false;

	// Shut down gracefully
	const shutdownGracefully = retCode => {
		retCode = typeof retCode !== 'undefined' ? retCode : 0;

    if (server) {
			if (shutdownInProgress) {
				return;
			}

			shutdownInProgress = true;
			logger.info('Shutting down gracefully...');
			server.close(
				db.close(() => {
					logger.info('Closed out remaining connections');
					process.exit(retCode);
				})
			);

			setTimeout(() => {
				logger.error('Could not close out connections in time, forcing shutdown');
				process.exit(retCode);
			}, 10 * 1000).unref();
		} else {
			logger.info('Http server is not running. Exiting');
			process.exit(retCode);
		}
	};

	process.on('uncaughtException', err => {
		logger.error('uncaughtException', err);
		shutdownGracefully(1);
	});

	process.on('SIGTERM', shutdownGracefully);
	process.on('SIGINT', shutdownGracefully);
	process.on('SIGQUIT', shutdownGracefully);
}

export default gracefulShutdown;
