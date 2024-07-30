const handlers = require('../handlers');

const sites = Object.keys(handlers);

const handleDownload = async (url, options) => {
	const parsedUrl = new URL(url);
	const site = sites.find((s) =>
		new RegExp(s, 'gi').test(parsedUrl.hostname)
	);
	console.log('site', site);
	await handlers[site].process(parsedUrl, options);
};

module.exports = { handleDownload };
