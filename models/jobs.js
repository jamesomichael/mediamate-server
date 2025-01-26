const databaseService = require('../services/sqlite');

const getJobByURL = async () => {};

const createJob = async (url, type = 'video') => {
	const data = { url, type, status: 'PENDING' };
	await databaseService.insert('jobs', data);
};

module.exports = { getJobByURL, createJob };
