require('dotenv').config();

const express = require('express');
const cors = require('cors');

const downloadsModel = require('./models/downloads.model');
const mediaModel = require('./models/media.model');
const database = require('./database/database');

const app = express();

const { PORT, DOWNLOAD_OUTPUT_DIR } = process.env;

app.use(express.json());
app.use(cors());

app.post('/download', async (req, res) => {
	try {
		const url = req?.body?.url;
		const type = req?.body?.type;
		const shouldDownloadPlaylist = req?.body?.shouldDownloadPlaylist;

		if (!url) {
			res.status(500);
			res.json({ error: 'URL not provided.' });
			res.end();
			return;
		}

		await downloadsModel.handleDownload(url, {
			type,
			shouldDownloadPlaylist,
		});
		res.status(200);
		res.json({ success: true });
		res.end();
	} catch (error) {
		console.error(error.message);
		res.status(500);
		res.json({ error: 'Cannot download video.' });
		res.end();
	}
});

app.get('/media', async (req, res) => {
	const mediaDir = req?.body?.mediaDir || DOWNLOAD_OUTPUT_DIR;
	const media = await mediaModel.getMedia(mediaDir);
	res.status(200);
	res.json(media);
	res.end();
});

// Start the server
app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	console.log('Serializing database...');
	await database.initialize();
	console.log('Serialization complete.');
});
