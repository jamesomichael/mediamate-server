const createJob = async (req, res) => {
	// console.log('req.body', req.request.body);
	const { body } = req;
	console.log('body', body);
	const { url } = body;
	res.status(200).json({ success: true, url });
};

module.exports = { createJob };
