const fs = require('fs');
const { MEDIA_DIR } = process.env;

const playMedia = async (req, res) => {
	const { name } = req.params;
	const { type } = req.query;
	const fileName = decodeURIComponent(name);
	const filePath = `${MEDIA_DIR}/${type}/${fileName}`;
	const stat = fs.statSync(filePath);
	const fileSize = stat.size;

	const range = req.headers.range;

	let fileStream;

	if (range) {
		const [start, end] = range
			.replace(/bytes=/, '')
			.split('-')
			.map(Number);

		const chunkStart = start || 0;
		const chunkEnd =
			end || Math.min(chunkStart + 1024 * 1024, fileSize - 1);

		if (chunkStart >= fileSize) {
			return res.status(416).send('Requested range not satisfiable');
		}

		fileStream = fs.createReadStream(filePath, {
			start: chunkStart,
			end: chunkEnd,
		});
		res.status(206);
		res.setHeader(
			'Content-Range',
			`bytes ${chunkStart}-${chunkEnd}/${fileSize}`
		);
		res.setHeader('Accept-Ranges', 'bytes');
		res.setHeader('Content-Length', chunkEnd - chunkStart + 1);
	} else {
		res.setHeader('Content-Length', fileSize);
		fileStream = fs.createReadStream(filePath);
	}
	res.setHeader('Content-Type', 'video/mp4');
	fileStream.pipe(res);
};

module.exports = {
	playMedia,
};
