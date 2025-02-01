const axios = require('axios');

const API_KEY = process.env.YOUTUBE_API_KEY;

const fetchPlaylistVideos = async (playlistId) => {
	const videoUrls = [];
	let nextPageToken;

	do {
		const response = await axios.get(
			'https://www.googleapis.com/youtube/v3/playlistItems',
			{
				params: {
					part: 'snippet',
					playlistId,
					maxResults: 50,
					key: API_KEY,
					...(nextPageToken && { pageToken: nextPageToken }),
				},
			}
		);

		response.data.items.forEach((item) => {
			const videoId = item.snippet.resourceId.videoId;
			videoUrls.push(`https://www.youtube.com/watch?v=${videoId}`);
		});

		nextPageToken = response.data.nextPageToken;
	} while (nextPageToken);

	return videoUrls;
};

module.exports = {
	fetchPlaylistVideos,
};
