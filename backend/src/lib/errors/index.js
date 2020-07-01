/**
 * Library To Handle Application Errors.
 */

import http from 'http';
import _ from 'lodash';
import CONFIG from '../../conf';
import HTTP_HEADERS from '../../enum/http/header';
import logger from '../logger';

/**
 * Parse error.
 * @param {Error} err
 * @returns {{message: *, code: *, stack: *}}
 */
const parseError = err => {
	let code;
	let message;
	let stack = null;

	if (err instanceof Error || _.isPlainObject(err)) {
		// Detects a mongoose/mongodb error. Probbaly not the best way to check for this
		if (Object.prototype.hasOwnProperty.call(err, 'ok') || Object.prototype.hasOwnProperty.call(err, 'driver')) {
			// we set code to 500, because mongoose also uses a code property that isn't an HTTP error
			// passing a mongoose error code into express res.status will cause the error reponses to crash express.
			code = 500;
		} else {
			code = err.status || err.code || 500;
		}

		message = err.message || err.toString() || http.STATUS_CODES[500];
		stack = err.stack ? JSON.stringify(err.stack, null, 2) : null;
	} else if (_.isNumber(parseInt(err, 10))) {
		err = parseInt(err, 10);
		code = err;
		message = http.STATUS_CODES[err];
	} else if (_.isString(err)) {
		message = err;
	} else {
		code = 500;
		message = http.STATUS_CODES[500];
		logger.warn('Unknown client error object type.', err);
	}

	// Santiy check, because technically a non HTTP status code should have not reached this point
	if (code < 100 || code > 600) code = 500;

	return {
		message,
		code,
		stack,
	};
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
function init(req, res, next) {
	res.error = (err, code) => {
		err = parseError(err);

		// Log error.
		logger.error(err);

		// Set HTTP response header cache control.
		res.set(
			HTTP_HEADERS.CACHE_CONTROL,
			'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
		);

		// Remove any stack traces during production and testing environment.
		if (!CONFIG.IS_DEV) {
			delete err.stack;
		}

		res.status(code || err.code).json(err);
	};

	next();
}

export { default as UnauthorizedError } from './types/unauthorized-error';
export { default as BadRequestError } from './types/bad-request-error';
export { default as ConflictError } from './types/conflict-error';
export { default as ForbiddenError } from './types/forbidden-error';
export { default as InternalServerError } from './types/internal-server-error';
export { default as NotFoundError } from './types/not-found-error';
export { default as ValidationError } from './types/validation-error';
export default { init };
