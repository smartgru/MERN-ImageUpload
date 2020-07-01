import ENVIRONMENT from '../enum/environment';

export default {
	ENV: ENVIRONMENT.TEST,
	MONGO: {
		/** MongoDB Connection URI */
		URI: 'mongodb://root:password@localhost:27017/image-test?authSource=admin',
	},
	/**
	 * Display logs
	 * */
	IS_LOG_SILENT: true,
};
