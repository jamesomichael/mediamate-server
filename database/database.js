const sqlite = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const { SERIALIZE_QUERIES, buildInsertionData } = require('./helpers');

const { DATABASE_FILE_PATH } = process.env;

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
	initialize: async () => {
		const db = await connect();
		const promises = SERIALIZE_QUERIES.map((query) => db.run(query));
		await Promise.all(promises);
		await close(db);
	},
	insert: async (downloadData) => {
		const { id } = downloadData;
		try {
			const db = await connect();
			const { query, dataArray } = buildInsertionData(downloadData);
			console.log('Inserting data:', JSON.stringify(downloadData));
			await db.run(query, dataArray);
			await close(db);
		} catch (error) {
			return console.error(err.message);
		}
		console.log(`Data has been inserted for download '${id}'.`);
	},
	selectAll: async () => {
		console.log('Selecting all data...');
		try {
			const query = 'SELECT * FROM `downloads`;';
			// console.log('db', db);
			// const data = await db.all(query);
			// const db1 = await sqlite.open({
			// 	filename: DATABASE_FILE_PATH,
			// 	driver: sqlite3.Database,
			// });
			const db = await connect();
			const data = await db.all(query);
			console.log(data);
			console.log(`Data: ${JSON.stringify(data)}`);
			await close(db);
			return data;
		} catch (error) {
			return console.error(err.message);
		}
	},
};
