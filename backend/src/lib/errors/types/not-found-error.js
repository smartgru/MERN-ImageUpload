class NotFoundError extends Error {
	constructor(message = "This resource wasn't found or you don't have priveleges to view it") {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.code = 404;
		this.type = this.name;
	}
}

export { NotFoundError as default };
