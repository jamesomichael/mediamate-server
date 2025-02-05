const express = require('express');
const { celebrate } = require('celebrate');
const asyncHandler = require('express-async-handler');

const playController = require('../controllers/play');
const playSchema = require('../schemas/play');

const router = express.Router();

router.get(
	'/:name',
	celebrate(playSchema.play),
	asyncHandler(playController.playMedia)
);

module.exports = router;
