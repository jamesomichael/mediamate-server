require('dotenv').config();

const express = require('express');
const cors = require('cors');

const downloadsModel = require('./models/downloads.model');

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(cors());

app.post('/download', async (req, res) => {
	const url = req?.body?.url;
	const type = req?.body?.type;
	const shouldDownloadPlaylist = req?.body?.shouldDownloadPlaylist;

	if (!url) {
		res.status(500);
		res.json({ error: 'URL not provided.' });
		res.end();
		return;
	}

	await downloadsModel.handleDownload(url, { type, shouldDownloadPlaylist });
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
