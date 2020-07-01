import http from 'http';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import express from 'express';
import _ from 'lodash';
import compression from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressWinston from 'express-winston';
import expressPrettify from 'express-prettify';

import './namespaces';

import CONFIG from './conf';
import { APP_REQUIRED_DIRS, HTTP_HEADERS, ORIGIN_ALLOWED } from './enum';
import { logger, errors, db, gracefulShutdown, pruneReqBody } from './lib';
import NotFoundHandler from './lib/helpers/NotFoundHandler';
import GlobalErrorHandler from './lib/helpers/GlobalErrorHandler';
import routes from './routes';

/** Application Initiate State */
let isInitiated = false;

/** Application Configs */
const APP_CONFIG = CONFIG.APP;

/** Express App */
const app = express();

/** HTTP Server */
const server = http.createServer(app);

/**
 * Set Application Default Headers.
 */
function setAppDefaultHeaders() {

	app.use((req, res, next) => {
		const requestHeaderOrigin = req.header('Origin');
		logger.info(`requestheader - ${requestHeaderOrigin}`);
		const isOriginAllowed = !CONFIG.IS_DEV ? ORIGIN_ALLOWED.indexOf(requestHeaderOrigin) !== -1 : true;

		res.header(HTTP_HEADERS.ACCESS_CONTROL_ALLOW_METHODS, 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
		res.header(HTTP_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS, 'true');
		res.header(
			HTTP_HEADERS.ACCESS_CONTROL_ALLOW_HEADERS,
			'Content-Type, Authorization, Cache-Control, X-Requested-With'
		);

		if (isOriginAllowed) {
			res.header(HTTP_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN, requestHeaderOrigin);
		}

		// res.header("Origin", isOriginAllowed ? requestHeaderOrigin : '');
		// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		next();
	});

	app.set(HTTP_HEADERS.ENV, CONFIG.ENV);
	app.set(HTTP_HEADERS.X_POWERED_BY, `${APP_CONFIG.NAME} v${APP_CONFIG.VERSION}`);

	// staging and production both use an nginx proxy therefore allow cookies to be shared by setting trust proxy
	if (!CONFIG.IS_DEV) {
		app.set('trust proxy', 1);
	}
}

/**
 * Set Application Default Handlers
 */
function setAppDefaultHandlers() {
	app.use(compression());

	app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

	app.use(bodyParser.json({ limit: '50mb' }));

	app.use(expressPrettify({ query: 'pretty' }));

	app.use(methodOverride());

	app.use(cookieParser(APP_CONFIG.SESSION_SECRET));
}

/**
 * Set Application Route Handler
 */
function setAppRoutes() {
	/**
	 * Default API Entry Point.
	 */
	app.get('/', (req, res) => {
		res.json({
			message: `${APP_CONFIG.NAME} v${APP_CONFIG.VERSION}`,
		});
	});

	routes(app, server);

	/** Express default error handlers */
	app.use(NotFoundHandler());
	app.use(GlobalErrorHandler());
}

function configureServer() {
	logger.info('Configuring Express');

	setAppDefaultHeaders();
	setAppDefaultHandlers();

	/**
	 * Express ErrorHandler.
	 * Adds res.error method to express res object for sending the client errors.
	 */
	app.use(errors.init);

	// express-winston request logging (before routes only, but after static paths to cut down on logging)
	expressWinston.requestWhitelist.push('session');
	expressWinston.requestWhitelist.push('ip');

	/**
	 * Log Transport Handler.
	 */
	const logTransports = _.values(logger.transports);

	/** Log API Requests */
	const logRequests = expressWinston.logger({
		transports: logTransports,
		meta: false,
		level: 'info',
		msg:
			"REQ->[{{req.headers['x-forwarded-for'] || req.connection.remoteAddress}}] {{req.method}} @ {{req.originalUrl}} in {{res.responseTime}}ms ({{res.statusCode}})",
	});

	app.use(logRequests);

	// NOTE: Removes all null or undefined properties from req.body in POST/PUT requests
	app.use(pruneReqBody);

	/**
	 * Application Route Handler
	 */
	setAppRoutes();

	return new Promise(resolve => {
		server.listen(APP_CONFIG.PORT, APP_CONFIG.IP, () => {
			logger.info(
				'EXPRESS UP -> ON %s:%d, HOST: %s, MongoDB Connected @ %s',
				APP_CONFIG.IP,
				APP_CONFIG.PORT,
				APP_CONFIG.API_URL,
				CONFIG.MONGO.URI
			);

			// Change Application Initiate State
			isInitiated = true;

			resolve(server);
		});
	});
}

/**
 * Ensure required directories exist for application to be initiated.
 * @param {String[]} dirs List of directories that need to be checked.
 */
function ensureRequiredDir(dirs) {
	const baseDir = CONFIG.ROOT;
	const dirList = dirs || [];
	let dirPath;

	dirList.forEach(dir => {
		dirPath = path.resolve(baseDir, dir);

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
		}
	});
}

/**
 * Initiate Application
 * @returns {Promise}
 */
function init() {
	if (isInitiated) {
		return Promise.resolve(server);
	}

	logger.info(`Starting server in NODE_ENV=${CONFIG.ENV}`);

	ensureRequiredDir(APP_REQUIRED_DIRS);

	return db.connect(CONFIG.MONGO).then(configureServer);
}

if (require.main === module) {
	init()
		.then(() => {
			gracefulShutdown(server);
		})
		.catch(err => {
			logger.error(err);
		});
}

export default init;
