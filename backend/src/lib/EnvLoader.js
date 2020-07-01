/**
 * Env Loader will load all files in directory it's initiated with and
 * assign the variables values or use the default value set.
 */

import path from 'path';
import fs from 'fs';

class EnvLoader {
	/**
	 * Constructor
	 * @param {Object} options
	 * @param {String} options.envDirectory - Base directory to load env variables from.
	 */
	constructor(options) {
		let envDirectory = options.envDirectory || '';

		if (envDirectory === '') {
			throw new Error('Env base directory need to be assigned');
		}

		// Set properties.
		this.envDirectory = envDirectory;

		// Load env variables.
		this.load();
	}

	/**
	 * Load env directory variables.
	 */
	load() {
		let envDir = this.envDirectory,
			fileList = [];

		fs.readdirSync(envDir).forEach(file => {
			let filePath = path.join(envDir, file),
				isDir = fs.statSync(filePath).isDirectory(),
				isValidEnvFile = !isDir && !(file.indexOf('.') > -1);

			if (isValidEnvFile) {
				fileList.push(file);
			}
		});

		this.loadVariables(fileList);
	}

	/**
	 * Load env variables into system.
	 * @param {String[]} fileList - List of environment variables.
	 */
	loadVariables(fileList) {
		let envDir = this.envDirectory,
			envVars = [];

		fileList.forEach(file => {
			let filePath = path.join(envDir, file),
				fileContent = fs.readFileSync(filePath, 'utf8'),
				envKey = file.toUpperCase(),
				envVal = fileContent.trim();

			if (envVal !== '') {
				envVars[envKey] = envVal;
			}
		});

		this.envVariables = envVars;
	}

	/**
	 * Get environment variable value
	 * @param {String} envKey  - Environment key to load.
	 * @param {String|Number|Boolean} defaultValue  - Default value to set if fail to load variable.
	 */
	get(envKey, defaultValue) {
		envKey = envKey.toUpperCase();

		let envVars = this.envVariables;

		return envVars[envKey] ? envVars[envKey] : defaultValue;
	}
}

export default EnvLoader;
