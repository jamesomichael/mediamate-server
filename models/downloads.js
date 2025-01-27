const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

const downloadService = require('../services/ytdlp');
const databaseService = require('../services/sqlite');

const processDownload = async ({ id = uuidv4(), url, type }) => {
	await downloadService.download(url, type);
	const data = {
		id,
		url,
		type,
		addedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
	};
	await databaseService.insert('downloads', data);
};

module.exports = {
	processDownload,
};
