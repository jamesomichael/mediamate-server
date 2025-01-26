const express = require('express');
const { celebrate } = require('celebrate');
const asyncHandler = require('express-async-handler');

const jobsController = require('../controllers/jobs');
const jobsSchemas = require('../schemas/jobs');

const router = express.Router();

router.post(
	'/',
	celebrate(jobsSchemas.createJob),
	asyncHandler(jobsController.createJob)
);

module.exports = router;
