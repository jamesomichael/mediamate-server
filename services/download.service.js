const childProcess = require('child_process');
const path = require('path');
const os = require('os');

const { YT_DLP_PATH } = process.env;

const runCommand = (args) => {
	return new Promise((resolve, reject) => {
		const scriptPath = path.join(os.homedir(), YT_DLP_PATH);
		const child = childProcess.spawn('python3', [scriptPath, ...args], {
			encoding: 'utf-8',
		});
		let output = '';
		let error = '';

		child.stdout.on('data', (data) => {
			output += data.toString();
			console.log(`[YT-DLP] ${data}`);
		});

		child.stderr.on('data', (data) => {
			error += data.toString();
			console.error(`[YT-DLP] ${data}`);
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

const download = async (args) => {
	console.log('Starting download...');
	await runCommand(args);
	console.log('Download complete.');
};

module.exports = download;
