const jobsModel = require('../models/jobs');

const createJob = async (req, res) => {
	const { body } = req;
	const { url, type } = body;
	try {
		const data = await jobsModel.createJob(url, type);
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
