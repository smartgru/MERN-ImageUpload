import nullPrune from 'null-prune';

function middleware(req, res, next) {
	const hookedMethods = ['POST', 'PATCH'];
	if (hookedMethods.includes(req.method)) nullPrune(req.body, {});
	next();
}

export default middleware;
