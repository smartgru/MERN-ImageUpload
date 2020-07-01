class InternalServerError extends Error {
	constructor(message = 'The server failed to process your request') {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.code = 500;
		this.type = this.name;
	}
}

export { InternalServerError as default };
