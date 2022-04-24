const Joi = require('joi');
const Joiput = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  pwd: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  access_token: [Joi.string(), Joi.number()],
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
});

module.exports = Joiput;
