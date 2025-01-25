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
		let videoInfo;

		// TODO: REMOVE ONCE SUPPORT HAS BEEN ADDED...
		if (shouldDownloadPlaylist) {
			throw new Error('Playlists are not currently supported.');
		}

		try {
			const filteredUrl = filterUrl(url, shouldDownloadPlaylist);
			try {
				videoInfo = await ytdl.getInfo(filteredUrl.href);
			} catch (error) {
				console.error(error);
				throw new Error(
					'Cannot get YouTube video information. The video may have been deleted or is age-restricted.'
				);
			}

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
				embed: { iframeUrl: embedUrl = '' } = {},
				thumbnails: videoThumbnails,
			} = videoInfo.videoDetails;

			const channelProfilePicUrl = authorThumbnails[2].url;
			const videoThumbnail = videoThumbnails.pop();
			const videoThumbnailUrl = videoThumbnail.url;

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
			const [thumbnailFileName, channelProfilePicFileName] =
				await Promise.all(assetPromises);

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
				thumbnailFileName,
				category,
				chapters,
				channelId,
				channelName,
				channelUser,
				channelUrl,
				channelProfilePicUrl,
				channelProfilePicFileName,
				embedUrl,
			};

			await database.insert(downloadData);

			const audioArgs =
				type === 'audio' ? ['-x', '--audio-format', 'mp3'] : [];
			const args = [
				...audioArgs,
				// ...['--write-sub', '--write-auto-sub', '--sub-lang', '"en.*"'],
				filteredUrl,
				'-P',
				`${DOWNLOAD_OUTPUT_DIR}/${type}`,
			];

			await download(args);
		} catch (error) {
			console.error(error.message);
			throw new Error('Cannot process YouTube video.');
		}
		return true;
	},
};
