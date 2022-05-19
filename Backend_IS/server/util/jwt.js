const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const jwtwrap = async (req) => {
  let who;
  try {
    who = await promisify(jwt.verify)(
      req.get('Authorization').replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
    return who;
  } catch (err) {
    return { error: 'wrong token' };
  }
};

const jwtsk = async (token) => {
  let who;
  try {
    who = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return who;
  } catch (err) {
    return { error: 'wrong token' };
  }
};

module.exports = { jwtwrap, jwtsk };
