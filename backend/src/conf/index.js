/**
 * Application Configuration File
 */

import path from 'path';
import _ from 'lodash';
import { ENV_KEY, ENVIRONMENT } from '../enum';
import EnvLoader from '../lib/EnvLoader';
import ENV_TEST from './test';

const ROOT_DIR = process.cwd();

/**
 * Load env variables.
 */
const ENV_VARS = new EnvLoader({
	envDirectory: path.resolve(ROOT_DIR, 'src/conf/env'),
});

const ENV = process.env.NODE_ENV || ENV_VARS.get(ENV_KEY.ENV, ENVIRONMENT.DEV);
const isDev = ENV === ENVIRONMENT.DEV;
const isProd = ENV === ENVIRONMENT.PROD;
const DOMAIN = ENV_VARS.get(ENV_KEY.DOMAIN, 'localhost');

const init = {
	/**
	 * Application Running Environment.
	 */
	ENV,

	/**
	 * Application Root Directory
	 */
	ROOT: ROOT_DIR,

	/**
	 * Application Domain.
	 */
	DOMAIN,

	/**
	 * Logging
	 * */
	LOG: true,

	/**
	 * Display logs
	 * */
	IS_LOG_SILENT: false,

	/**
	 * Determine If Application Running In Development Environment.
	 */
	IS_DEV: isDev,

	/**
	 * Determine If Application Running In Production Environment.
	 */
	IS_PROD: isProd,

	/**
	 * Determine If Application Running In Test Environment.
	 */
	IS_TEST: ENV === ENVIRONMENT.TEST,

	/**
	 * @deprecated
	 */
	SHARED_PATHS: {
		LOGS: path.resolve(ROOT_DIR, 'logs'),
		UPLOAD: path.resolve(ROOT_DIR, 'uploads'),
		DATA: path.resolve(ROOT_DIR, 'data'),
	},

	/** Image Size */
	MAX_IMAGE_SIZE: 1000,
	/**
	 * Application Configs
	 */
	APP: {
		/** Application Name */
		NAME: 'IMAGE-API', // APP_PACKAGE.name

		/** Application Version */
		VERSION: '1.0', // APP_PACKAGE.version

		/** Application API Entry Url */
		API_URL: `https://${DOMAIN}/api`,

		URL: `https://${DOMAIN}`,

		/** IP address to listen */
		IP: ENV_VARS.get(ENV_KEY.BIND_IP, '127.0.0.1'),

		/** Port Number To Listen */
		PORT: Number.parseInt(ENV_VARS.get(ENV_KEY.BIND_PORT, '4000'), 10),

		/** Secret Key Used For Authentication */
		SESSION_SECRET: ENV_VARS.get(ENV_KEY.SESSION_SECRET, 'image-secret-key'),

		PUBLIC_DIR: '/public',
		UPLOAD_DIR: '/public/uploads',
		ASSETS_DIR: '/public/assets',
	},

	/**
	 * MongoDB Configuration
	 */
	MONGO: {
		/** MongoDB Connection URI */
		URI: ENV_VARS.get(ENV_KEY.MONGO_DB_URI, 'mongodb://127.0.0.1:27017/image-dev'),

		/** Username */
		USERNAME: ENV_VARS.get(ENV_KEY.MONGO_DB_USER, null),

		/** Password */
		PASSWORD: ENV_VARS.get(ENV_KEY.MONGO_DB_PASSWORD, null),

		/** MongoDB Connection Options */
		OPTIONS: {
			useNewUrlParser: true,
			reconnectTries: Number.MAX_VALUE,
			reconnectInterval: 500,
			connectTimeoutMS: 10000,
		},
	},
};
const environment = {
	test: ENV_TEST,
};

const CONFIG = _.merge(init, environment[process.env.NODE_ENV] || {});

export default CONFIG;
