/**
 * Handles Application Http Unauthorized Access Errors.
 */

import HTTP_RESPONSE_TYPES from '../../../enum/http/response_types';

/**
 * Default Response Message.
 */
const defaultMessage = HTTP_RESPONSE_TYPES.UNAUTHORIZED_ACCESS.MESSAGE;

/**
 * UnauthorizedError Class
 */
class UnauthorizedError extends Error {
	/**
	 * Initiate class method.
	 * @param {String} message
	 */
	constructor(message = defaultMessage) {
		super(message);

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;
		this.message = message;
		this.code = HTTP_RESPONSE_TYPES.UNAUTHORIZED_ACCESS.CODE;
		this.type = this.name;
	}
}

export { UnauthorizedError as default };
