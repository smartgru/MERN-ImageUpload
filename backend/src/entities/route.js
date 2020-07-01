/**
 * Entity to handle application routes.
 *
 * @param {Object} options
 * @property {String} options.path  Route Path
 * @property {Module} options.handler  Route Handler Module
 *
 * @returns {RouteEntity}
 */
function RouteEntity(options) {
	const strPath = options.path || Error('Route path is not defined.');
	const handler = options.handler || Error('Route handler is not defined.');

	return {
		path: strPath,
		handler,
	};
}

export default RouteEntity;
