const jobsModel = require('../models/jobs');

const createJob = async (req, res) => {
	const { body } = req;
	const { url, type, playlist: isPlaylist } = body;
	try {
		const data = await jobsModel.createJob(url, type, isPlaylist);
		res.status(200).json({ success: true, ...data });
	} catch (error) {
		if (/UNIQUE constraint failed/.test(error.message)) {
			res.status(409).json({
				success: false,
				message: 'A job has already been created for this item.',
			});
		}
	}
};

module.exports = { createJob };
