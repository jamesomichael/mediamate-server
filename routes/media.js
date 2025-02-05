const express = require('express');
const asyncHandler = require('express-async-handler');

const mediaController = require('../controllers/media');

const router = express.Router();

router.get('/', asyncHandler(mediaController.fetchMedia));

module.exports = router;
