if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const jobsRoutes = require('./routes/jobs');

const { PORT } = process.env;

// const apiDoc = require('./docs/openapi.yml');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(errors());

app.use('/docs', (req, res) => {
	res.send(apiDoc);
});

app.use('/jobs', jobsRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
