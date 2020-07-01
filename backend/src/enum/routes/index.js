/**
 * Application Route List.
 */

 import RouteEntity from '../../entities/route';
 import image from '../../routes/image'

 /**
 * Helper method to define new route.
 * @param {Object} options
 * @return {RouteEntity}
 */
function defineRoute(options) {
	return new RouteEntity(options);
}

/**
 * Returns list of all application handled routes.
 * @returns {RouteEntity[]}
 */
export default [
	/**
	 * Image
	 */
	defineRoute({
		path: `/image`,
		handler: image,
  }),
];
