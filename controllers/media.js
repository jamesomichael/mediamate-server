const mediaModel = require('../models/media');

const fetchMedia = async (req, res) => {
	try {
		const data = await mediaModel.getMedia();
		res.status(200).json({ success: true, ...data });
	} catch (error) {
		console.error(`[fetchMedia] ${error.message}`);
		res.status(500).json({
			success: false,
			message: 'Something went wrong.',
		});
	}
};

module.exports = { fetchMedia };
