const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { ASSET_OUTPUT_PATH } = process.env;

const downloadAsset = async (url, fileName, type) => {
	try {
		console.log(`Fetching ${type} asset using URL \'${url}\'...`);
		const response = await axios({
			url,
			responseType: 'stream',
		});

		const filePath = `${ASSET_OUTPUT_PATH}/${type}s/${fileName}.png`;
		const writer = fs.createWriteStream(filePath);
		response.data.pipe(writer);
		await new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
		console.log(`Asset saved to '${filePath}'.`);
		return fileName;
	} catch (error) {
		console.error('Cannot download asset:', JSON.stringify(error));
		return false;
	}
};

module.exports = { downloadAsset };
