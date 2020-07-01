import ApiError from '../errors/ApiError';
import HttpResponseType from '../../enum/http/response_types';

/**
 * Express default error 404, not found handler.
 * @returns {Function}
 */
export default () => {
	let NotFound = HttpResponseType.NOT_FOUND;

	return (req, res, next) => {
		let error = new ApiError(`${NotFound.MESSAGE} '${req.url}'`, NotFound.CODE);
		next(error);
	};
};
