/**
 * Class representing an API error.
 * @extends Error
 */
class ApiError extends Error {
	/**
	 * Creates an API error.
	 * @param {String} message
	 * @param {Number} [status]
	 */
	constructor(message, status = 400) {
		super(message);

		this.name = this.constructor.name;
		this.message = message;
		this._status = status;

		Error.captureStackTrace(this, this.constructor.name);
	}

	get statusCode() {
		return this._status;
	}
}

module.exports = ApiError;
