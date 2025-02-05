const { Joi } = require('celebrate');

const play = {
	params: Joi.object({
		name: Joi.string().required(),
	}),
	query: Joi.object({
		type: Joi.string().valid('audio', 'video').required(),
	}),
};

module.exports = { play };
