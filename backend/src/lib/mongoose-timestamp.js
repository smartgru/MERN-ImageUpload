function timestampPlugin(schema) {
	schema.pre('findOneAndUpdate', function preFindAndUpdate() {
		this.update({}, { $set: { updatedAt: new Date() } });
	});

	schema.pre('update', function preUpdate() {
		this.update({}, { $set: { updatedAt: new Date() } });
	});

	schema.pre('save', function preSave(next) {
		this.updatedAt = new Date();
		next();
	});
}
export default { timestampPlugin };
