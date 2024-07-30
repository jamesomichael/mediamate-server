const fs = require('fs');

const database = require('../database/database');

module.exports = {
	getMedia: async (mediaDir) => {
		const media = {
			video: {},
			audio: {},
			// assets: {
			// 	channelProfilePics: {},
			// 	thumbnails: {},
			// },
		};
		// const videoDir = `${mediaDir}/video`;
		// const audioDir = `${mediaDir}/audio`;
		// const assetDir = `${mediaDir}/assets`;
		// const files = fs.readdirSync(dir);
		// files.forEach((file) => {
		// 	console.log('file', file);
		// });
		const downloadsMetadata = await database.selectAll();
		console.log('downloadsMetadata', downloadsMetadata);
		return;
		Object.entries(media).forEach(([key, value]) => {
			const dir = `${mediaDir}/${key}`;
			const files = fs.readdirSync(dir);
			const filteredFiles = files.filter((file) => file !== '.DS_Store');
			value.dir = dir;
			value.files = filteredFiles;
		});

		console.log('media', media);
	},
};
