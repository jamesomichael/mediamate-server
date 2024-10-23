const download = require('../services/download.service');

const { DOWNLOAD_OUTPUT_DIR } = process.env;

module.exports = {
	process: async (url) => {
		try {
			const args = [url, '-P', `${DOWNLOAD_OUTPUT_DIR}/video`];

			await download(args);
		} catch (error) {
			console.error(error.message);
			throw new Error('Cannot process generic video.');
		}
		return true;
	},
};
