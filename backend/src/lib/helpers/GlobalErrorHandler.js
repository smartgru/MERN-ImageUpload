import CONFIG from '../../conf';
import HttpResponseType from '../../enum/http/response_types';

/**
 * Express global error handler.
 * @returns {Function}
 */
export default () => {
	let InternalServerError = HttpResponseType.INTERNAL_SERVER_ERROR,
		returnResponse;

	return (err, req, res, next) => {
		let statusCode = err.statusCode || InternalServerError.CODE,
			errorMessage = err.message || InternalServerError.MESSAGE;

		returnResponse = {
			success: false,
			error: {
				code: statusCode,
				message: errorMessage,
			},
		};

		if (CONFIG.IS_DEV && statusCode === InternalServerError.CODE) {
			returnResponse.error.stack = err.stack.split('\n')[1].trim();
		}

		res.json(returnResponse);
	};
};
