/**
 * Handle Application Http Response Codes
 */

export default {
	/**
	 * Unauthorized Access.
	 */
	UNAUTHORIZED_ACCESS: {
		CODE: 401,
		MESSAGE: 'You must be authenticated to perform this action',
	},

	/**
	 * Not Found.
	 */
	NOT_FOUND: {
		CODE: 404,
		MESSAGE: 'Unable to find your request',
	},

	/**
	 * Internal Server Error.
	 */
	INTERNAL_SERVER_ERROR: {
		CODE: 500,
		MESSAGE: 'Internal server error',
	},
};
