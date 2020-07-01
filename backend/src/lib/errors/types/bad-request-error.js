class BadRequestError extends Error {
	constructor(message = "Your request isn't valid") {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.code = 400;
		this.type = this.name;
	}
}

export { BadRequestError as default };
