const { Joi } = require('celebrate');

const createJob = {
	body: Joi.object().keys({
		url: Joi.string().uri().required(),
		type: Joi.string().valid('audio', 'video').default('video'),
		playlist: Joi.boolean().default(false),
	}),
};

module.exports = { createJob };
