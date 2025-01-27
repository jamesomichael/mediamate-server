const cron = require('node-cron');
const dayjs = require('dayjs');

const database = require('./services/sqlite');
const downloadsModel = require('./models/downloads');

const isInProgress = async () => {
	const [job] = await database.select('SELECT * FROM jobs WHERE status = ?', [
		'IN_PROGRESS',
	]);

	if (job) {
		return true;
	}
	return false;
};

const processPendingJobs = async () => {
	if (await isInProgress()) {
		console.log('[processPendingJobs] A job is already in progress.');
		return;
	}

	console.log('[processPendingJobs] Checking for pending jobs...');
	const [job] = await database.select('SELECT * FROM jobs WHERE status = ?', [
		'PENDING',
	]);

	if (job) {
		const { id } = job;
		const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
		try {
			await database.update(
				'UPDATE jobs SET status = ?, updatedAt = ? WHERE id = ?',
				['IN_PROGRESS', updatedAt, id]
			);
			console.log(`[processPendingJobs] Processing job ${id}...`);
			await downloadsModel.processDownload(job);
			console.log(`[processPendingJobs] Marking job as complete...`);
			await database.update(
				'UPDATE jobs SET status = ?, updatedAt = ?, completedAt = ? WHERE id = ?',
				['COMPLETED', updatedAt, updatedAt, id]
			);
			console.log('[processPendingJobs] Finished.');
		} catch (error) {
			console.error(`[processPendingJobs] ${error.message}`);
			await database.update(
				'UPDATE jobs SET status = ?, updatedAt = ?, error = ? WHERE id = ?',
				['FAILED', updatedAt, error.message, id]
			);
		}
	} else {
		console.log('[processPendingJobs] No jobs pending.');
	}
};

const scheduleTasks = () => {
	cron.schedule('* * * * *', processPendingJobs);
};

module.exports = { scheduleTasks };
