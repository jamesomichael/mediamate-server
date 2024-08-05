const fs = require('fs');

const database = require('../database/database');

const extractVideoId = (str) => {
	const regex = /\[([a-zA-Z0-9_-]+)\](?:\.\w+)?$/;
	const match = str.match(regex);
	return match ? match[1] : null;
};

module.exports = {
	getMedia: async (mediaDir) => {
		const types = ['audio', 'video'];
		const downloadsMetadata = await database.selectAll();
		const media = [];
		types.forEach((type) => {
			const dir = `${mediaDir}/${type}`;
			const files = fs.readdirSync(dir);
			const detailedFiles = files
				.filter((file) => file !== '.DS_Store')
				.map((file) => {
					const videoId = extractVideoId(file);
					const [metadata = {}] = downloadsMetadata.filter(
						(data) => data.id === videoId && data.type === type
					);
					metadata.fileName = file;
					metadata.fileLocation = `${dir}/${file}`;
					return metadata;
				});
			media.push(...detailedFiles);
		});
		return media;
	},
};
