const Joi = require('joi');
const Joischema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  pwd: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
  access_token: [Joi.string(), Joi.number()],
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
});
module.exports = Joischema;
