if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const jobsRouter = require('./routes/jobs');
const database = require('./services/sqlite');

const { scheduleTasks } = require('./tasks');

const { PORT } = process.env;

// const apiDoc = require('./docs/openapi.yml');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(errors());

app.use('/docs', (req, res) => {
	res.send(apiDoc);
});

app.use('/jobs', jobsRouter);

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}...`);
	console.log('Serialising database...');
	await database.serialise();
	console.log('Database serialised.');
});

scheduleTasks();
