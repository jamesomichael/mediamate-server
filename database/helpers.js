const SERIALIZE_QUERIES = [
	`CREATE TABLE IF NOT EXISTS \`downloads\` (\
	    \`id\` TEXT NOT NULL,\
		\`type\` TEXT NOT NULL,\
		\`source\` TEXT NOT NULL,\
	    \`title\` TEXT NOT NULL,\
	    \`description\` TEXT NULL,\
		\`durationInSeconds\` INTEGER NULL,\
		\`url\` TEXT NULL,\
		\`uploadedAt\` DATETIME NULL,\
		\`thumbnailUrl\` TEXT NULL,\
		\`thumbnailFileName\` TEXT NULL,\
		\`category\` TEXT NULL,\
		\`chapters\` BLOB NULL,\
		\`channelId\` TEXT NULL,\
		\`channelName\` TEXT NULL,\
		\`channelUser\` TEXT NULL,\
		\`channelUrl\` TEXT NULL,\
		\`channelProfilePicUrl\` TEXT NULL,\
		\`channelProfilePicFileName\` TEXT NULL,\
		\`embedUrl\` TEXT NULL,\
		\`downloadedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,\
		PRIMARY KEY (\`id\`, \`type\`)\
	)`,
];

const buildInsertionData = (downloadData) => {
	const dataArray = [];
	let keysToInsert = 0;
	let query = 'INSERT INTO downloads (';
	Object.entries(downloadData).forEach(([key, value]) => {
		if (value === undefined) {
			return;
		}
		if (['chapters'].includes(key)) {
			dataArray.push(JSON.stringify(value));
		} else {
			dataArray.push(value);
		}
		query += `\`${key}\`,`;
		keysToInsert++;
	});
	query = `${query.slice(0, -1)}) VALUES (`;
	for (let i = 0; i < keysToInsert; i++) {
		query += '?,';
	}
	query = `${query.slice(0, -1)});`;
	return {
		query,
		dataArray,
	};
};

module.exports = {
	SERIALIZE_QUERIES,
	buildInsertionData,
};
