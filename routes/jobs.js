const express = require('express');
const { celebrate, Joi } = require('celebrate');
const asyncHandler = require('express-async-handler');

const jobsController = require('../controllers/jobs.controller');

const router = express.Router();

router.post(
	'/',
	celebrate({
		body: Joi.object().keys({
			url: Joi.string().uri().required(),
		}),
	}),
	asyncHandler(jobsController.createJob)
);

module.exports = router;
