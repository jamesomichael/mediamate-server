const { Joi } = require('celebrate');

const createJob = {
	body: Joi.object().keys({
		url: Joi.string().uri().required(),
	}),
};

module.exports = { createJob };
