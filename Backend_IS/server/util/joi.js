const Joi = require('joi');
const Joischema = Joi.object({
  Username: Joi.string().alphanum().min(3).max(30).required(),
  Password: Joi.string().min(8).max(30).required(),
  access_token: [Joi.string(), Joi.number()],
  Email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'nat', 'tw'] },
    })
    .required(),
  Birthday: Joi.string(),
});
module.exports = Joischema;
