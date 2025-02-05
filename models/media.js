const fs = require('fs');
const path = require('path');

const { MEDIA_DIR } = process.env;

const MEDIA_TYPES = ['audio', 'video'];

const getMedia = async () => {
	const [audioFiles, videoFiles] = MEDIA_TYPES.map((type) =>
		fs.readdirSync(`${MEDIA_DIR}/${type}`)
	);
	const files = {
		audio: audioFiles,
		video: videoFiles,
	};
	return files;
};

module.exports = { getMedia };
