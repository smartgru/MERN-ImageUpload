class ForbiddenError extends Error {
	constructor(message = "You don't have the proper privileges to access this resource") {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.code = 403;
		this.type = this.name;
	}
}

export { ForbiddenError as default };
