/**
 * Application Route Handler Helper
 */

import ROUTES from '../enum/routes';

export default function(app) {
	/**
	 * Define all application defined routes into express handler.
	 */
	ROUTES.forEach(route => {
		app.use(route.path, route.handler);
	});
}
