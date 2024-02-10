const Joi = require('joi')

const registerValidator = Joi.object({
    email: Joi.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base": "Email is not a valid email address",
    }),
  password: Joi.string().required(),
  }).strict();

module.exports = registerValidator