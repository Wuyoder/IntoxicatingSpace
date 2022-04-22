const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const jwtwrap = async (req) => {
  let who;
  try {
    who = await promisify(jwt.verify)(
      req.get('Authorization').replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
  } catch (err) {
    err = new Error();
    err.message = 'wrong token';
    return { error: err.message };
  }
  return who;
};

const jwtsk = async (token) => {
  let who;
  try {
    who = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    err = new Error();
    err.message = 'wrong token';
    return { error: err.message };
  }

  return who;
};

module.exports = { jwtwrap, jwtsk };
