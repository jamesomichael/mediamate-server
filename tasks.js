const cron = require('node-cron');
const dayjs = require('dayjs');

const youtube = require('./services/youtube');
const database = require('./services/sqlite');
const downloadsModel = require('./models/downloads');
const jobsModel = require('./models/jobs');

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
		const { url, id, isPlaylist, type } = job;
		const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
		try {
			if (isPlaylist) {
				const parsedUrl = new URL(url);
				const playlistId = parsedUrl.searchParams.get('list');
				const videoUrls = await youtube.fetchPlaylistVideos(playlistId);
				console.log('videoUrls', videoUrls);
				const promises = videoUrls.map((videoUrl) =>
					jobsModel.createJob(videoUrl, type)
				);
				await Promise.all(promises);
				await database.update('DELETE FROM jobs WHERE id = ?', [id]);
				return;
			}

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
