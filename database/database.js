const sqlite3 = require('sqlite3').verbose();

const { SERIALIZE_QUERIES, buildInsertionData } = require('./helpers');

const { DATABASE_FILE_PATH } = process.env;

const db = new sqlite3.Database(DATABASE_FILE_PATH, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the SQLite database.');
});

db.serialize(async () => {
	const promises = SERIALIZE_QUERIES.map((query) => db.run(query));
	await Promise.all(promises);
});

const insert = async (downloadData) => {
	const { id } = downloadData;
	try {
		const { query, dataArray } = buildInsertionData(downloadData);
		console.log('Inserting data:', JSON.stringify(downloadData));
		await db.run(query, dataArray);
	} catch (error) {
		return console.error(err.message);
	}
	console.log(`Data has been inserted for download '${id}'.`);
};

const close = async () => {
	console.log('Closing database connection...');
	try {
		await db.close();
	} catch (error) {
		return console.error(err.message);
	}
	console.log('Database connection closed.');
};

module.exports = { insert, close };
