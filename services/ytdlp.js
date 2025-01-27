const childProcess = require('child_process');
const path = require('path');
const os = require('os');

const { YT_DLP_PATH, DOWNLOAD_OUTPUT_DIR } = process.env;

const download = async (url, type, isPlaylist) => {
	const audioArgs = type === 'audio' ? ['-x', '--audio-format', 'mp3'] : [];
	const playlistArgs = isPlaylist ? [''] : ['--no-playlist'];
	const args = [
		...audioArgs,
		url,
		'-P',
		`${DOWNLOAD_OUTPUT_DIR}/${type}`,
		...playlistArgs,
	];
	return new Promise((resolve, reject) => {
		const scriptPath = path.join(os.homedir(), YT_DLP_PATH);
		const child = childProcess.spawn('python3', [scriptPath, ...args], {
			encoding: 'utf-8',
		});
		let output = '';
		let error = '';

		child.stdout.on('data', (data) => {
			output += data.toString();
			console.log(`[YT-DLP] ${data}`.trim());
		});

		child.stderr.on('data', (data) => {
			error += data.toString();
			console.error(`[YT-DLP] ${data}`.trim());
		});

		child.on('close', (code) => {
			if (code === 0) {
				resolve(`Script output:\n${output}`);
			} else {
				reject(`Script failed with code ${code}:\n${error}`);
			}
		});
	});
};

module.exports = { download };
