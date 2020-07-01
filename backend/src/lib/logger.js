import winston from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file'; // eslint-disable-line no-unused-vars
import CONFIG from '../conf';

const loggerConfig = {
	transports: [
		new winston.transports.DailyRotateFile({
			name: 'file#info',
			datePattern: '-yyyy-MM-dd.log',
			level: 'verbose',
			handleExceptions: true,
			json: true,
			prettyPrint: true,
			timestamp: true,
			colorize: false,
			filename: `${CONFIG.SHARED_PATHS.LOGS}/app-info`,
			// maxsize: 1000000,
			maxFiles: 5,
			silent: CONFIG.IS_LOG_SILENT,
		}),

		new winston.transports.DailyRotateFile({
			name: 'file#error',
			datePattern: '-yyyy-MM-dd.log',
			level: 'warn',
			handleExceptions: true,
			json: true,
			prettyPrint: true,
			timestamp: true,
			colorize: false,
			filename: `${CONFIG.SHARED_PATHS.LOGS}/app-error`,
			// maxsize: 1000000,
			maxFiles: 10,
			silent: CONFIG.IS_LOG_SILENT,
		}),
	],
};

loggerConfig.transports.push(
	new winston.transports.Console({
		level: 'silly',
		handleExceptions: true,
		prettyPrint: true,
		timestamp: true,
		colorize: true,
		json: false,
		silent: CONFIG.IS_LOG_SILENT,
	})
);

winston.addColors({
	debug: 'green',
	info: 'cyan',
	silly: 'purple',
	trace: 'magenta',
	verbose: 'magenta',
	warn: 'yellow',
	warning: 'yellow',
	error: 'red',
});

const logger = new winston.Logger(loggerConfig);

export default logger;
