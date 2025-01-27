const { v4: uuidv4 } = require('uuid');

const databaseService = require('../services/sqlite');

const getJobByURL = async () => {};

const createJob = async (url, type = 'video', isPlaylist = false) => {
	const data = { id: uuidv4(), url, type, status: 'PENDING', isPlaylist };
	await databaseService.insert('jobs', data);
	return data;
};

module.exports = { getJobByURL, createJob };
