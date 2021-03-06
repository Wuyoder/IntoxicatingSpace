const Joi = require('joi');
const Joiput = Joi.object({
  Name: Joi.string().alphanum().min(3).max(30),
  Password: Joi.string().min(8).max(30),
  access_token: [Joi.string(), Joi.number()],
  Email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'nat', 'tw'] },
  }),
});

module.exports = Joiput;
