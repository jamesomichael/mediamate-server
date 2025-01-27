const sqlite = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const { DATABASE_FILE_PATH } = process.env;

const SERIALIZE_QUERIES = [
	`CREATE TABLE IF NOT EXISTS \`jobs\` (\
		\`id\` INTEGER NOT NULL,
	    \`url\` TEXT NOT NULL,\
		\`type\` TEXT NOT NULL CHECK (\`type\` IN ('video', 'audio')),\
		\`status\` TEXT NOT NULL CHECK (\`status\` IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),\
		\`addedAt\` DATETIME NOT NULL DEFAULT (DATETIME('now', 'utc')),\
	    \`updatedAt\` DATETIME NULL DEFAULT (DATETIME('now', 'utc')),\
	    \`completedAt\` DATETIME NULL,\
		\`error\` TEXT NULL,\
		PRIMARY KEY (\`url\`, \`type\`)\
	)`,
	`CREATE TABLE IF NOT EXISTS \`downloads\` (\
		\`id\` INTEGER NOT NULL,
	    \`url\` TEXT NOT NULL,\
		\`type\` TEXT NOT NULL CHECK (\`type\` IN ('video', 'audio')),\
		\`addedAt\` DATETIME NOT NULL DEFAULT (DATETIME('now', 'utc')),\
		PRIMARY KEY (\`url\`, \`type\`)\
	)`,
];

const buildInsertionQuery = (tableName, data) => {
	const keys = Object.keys(data).filter((key) => data[key] !== undefined);
	const values = keys.map((key) => data[key]);
	const columns = keys.map((key) => `\`${key}\``).join(', ');
	const placeholders = keys.map(() => '?').join(', ');

	const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders});`;

	return {
		query,
		dataArray: values,
	};
};

const connect = async () => {
	console.log('Connecting to database...');
	try {
		const db = await sqlite.open({
			filename: DATABASE_FILE_PATH,
			driver: sqlite3.Database,
		});
		console.log('Connected.');
		return db;
	} catch (error) {
		return console.error(error);
	}
};

const close = async (db) => {
	console.log('Closing database connection...');
	try {
		await db.close();
	} catch (error) {
		return console.error(error);
	}
	console.log('Database connection closed.');
};

module.exports = {
	serialise: async () => {
		const db = await connect();
		const promises = SERIALIZE_QUERIES.map((query) => db.run(query));
		await Promise.all(promises);
		await close(db);
	},
	insert: async (tableName, data) => {
		const { url } = data;
		try {
			const db = await connect();
			const { query, dataArray } = buildInsertionQuery(tableName, data);
			console.log('Inserting data:', JSON.stringify(data));
			await db.run(query, dataArray);
			await close(db);
		} catch (error) {
			console.error(error.message);
			throw new Error(error.message);
		}
	},
	select: async (query, params = []) => {
		// try {
		const db = await connect();
		const results = await db.all(query, params);
		return results;
		// }
	},
	update: async (query, params = []) => {
		const db = await connect();
		const results = await db.run(query, params);
		return results;
	},
};
