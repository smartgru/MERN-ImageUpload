class ConflictError extends Error {
	constructor(message = 'This resource already exists') {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.code = 409;
		this.type = this.name;
	}
}

export { ConflictError as default };
