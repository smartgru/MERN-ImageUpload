import _ from 'lodash';

class ValidationError extends Error {
	constructor(message = 'There was a validation error', offendingProperties) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.code = 422;
		this.type = this.name;
		if (offendingProperties) {
			if (_.isArray(offendingProperties)) {
				this.offendingProperties = offendingProperties;
			} else if (_.isString(offendingProperties)) {
				this.offendingProperties = [{ property: offendingProperties, message: this.message }];
			} else {
				this.offendingProperties = [offendingProperties];
			}
		}
	}
}

export { ValidationError as default };
