const ytdl = require('ytdl-core');

const database = require('../database/database');
const download = require('../services/download.service');
const { downloadAsset } = require('../services/assets.service');

const { DOWNLOAD_OUTPUT_DIR } = process.env;

const SOURCE = 'youtube';
const WHITELISTED_PARAMS = ['v', 'list'];

const filterUrl = (url, shouldDownloadPlaylist) => {
	const searchParams = url.searchParams;
	const keysToDelete = [];

	for (const [key] of searchParams.entries()) {
		if (
			!WHITELISTED_PARAMS.includes(key) ||
			(key === 'list' && !shouldDownloadPlaylist)
		) {
			keysToDelete.push(key);
		}
	}
	keysToDelete.forEach((key) => searchParams.delete(key));
	return url;
};

module.exports = {
	process: async (url, options) => {
		const { type, shouldDownloadPlaylist = false } = options;

		// TODO: REMOVE ONCE SUPPORT HAS BEEN ADDED...
		if (shouldDownloadPlaylist) {
			throw new Error('Playlists are not currently supported.');
		}

		const filteredUrl = filterUrl(url, shouldDownloadPlaylist);
		const videoInfo = await ytdl.getInfo(filteredUrl.href);

		const {
			title: videoTitle,
			description: videoDescription,
			lengthSeconds: durationInSeconds,
			videoId,
			video_url: videoUrl,
			ownerChannelName: channelName,
			channelId,
			ownerProfileUrl: channelUrl,
			publishDate: uploadedAt,
			category,
			chapters,
			author: { user: channelUser, thumbnails: authorThumbnails },
			embed: { iframeUrl: embedUrl },
			thumbnails: videoThumbnails,
		} = videoInfo.videoDetails;

		const channelProfilePicUrl = authorThumbnails[2].url;
		const videoThumbnail = videoThumbnails.pop();
		const videoThumbnailUrl = videoThumbnail.url;

		const downloadData = {
			id: videoId,
			type,
			source: SOURCE,
			title: videoTitle,
			description: videoDescription,
			durationInSeconds,
			url: videoUrl,
			uploadedAt,
			thumbnailUrl: videoThumbnailUrl,
			category,
			chapters,
			channelId,
			channelName,
			channelUser,
			channelUrl,
			channelProfilePicUrl,
			embedUrl,
		};

		const assetData = [
			{
				type: 'thumbnail',
				url: videoThumbnailUrl,
				fileName: `${SOURCE}|${videoId}`,
			},
			{
				type: 'channelProfilePic',
				url: channelProfilePicUrl,
				fileName: `${SOURCE}|${encodeURIComponent(channelUser)}`,
			},
		];

		const assetPromises = assetData.map((data) =>
			downloadAsset(data.url, data.fileName, data.type)
		);
		await Promise.all(assetPromises);

		await database.insert(downloadData);

		const audioArgs =
			type === 'audio' ? ['-x', '--audio-format', 'mp3'] : [];
		const args = [
			...audioArgs,
			filteredUrl,
			'-P',
			`${DOWNLOAD_OUTPUT_DIR}/${type}`,
		];

		await download(args);
		return true;
	},
};
