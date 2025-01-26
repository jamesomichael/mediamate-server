const { v4: uuidv4 } = require('uuid');

const databaseService = require('../services/sqlite');

const getJobByURL = async () => {};

const createJob = async (url, type = 'video') => {
	const data = { id: uuidv4(), url, type, status: 'PENDING' };
	await databaseService.insert('jobs', data);
	return data;
};

module.exports = { getJobByURL, createJob };
