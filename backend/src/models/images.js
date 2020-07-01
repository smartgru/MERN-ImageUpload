import mongoose from 'mongoose';
import _ from 'lodash';

import timestampSchema from './schemas/timestamp';

let schema = {
	path: {
		type: String,
		required: true,
	},
	name: String,
	type: String,
	order: Number,
};

schema = _.merge({}, schema, timestampSchema);

schema = new mongoose.Schema(schema);

export default mongoose.model('Images', schema);
