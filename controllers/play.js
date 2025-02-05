const fs = require('fs');
const { MEDIA_DIR } = process.env;

const playMedia = async (req, res) => {
	const { name } = req.params;
	const { type } = req.query;
	const fileName = decodeURIComponent(name);
	const filePath = `${MEDIA_DIR}/${type}/${fileName}`;
	const stat = fs.statSync(filePath);
	const fileSize = stat.size;
	res.setHeader('Content-Type', 'video/mp4');
	res.setHeader('Content-Length', fileSize);
	const fileStream = fs.createReadStream(filePath);
	fileStream.pipe(res);
};

module.exports = {
	playMedia,
};
