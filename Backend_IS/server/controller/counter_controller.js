const db = require('../util/mysql');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const counter_logins = async (req, res) => {
  let who;
  try {
    who = await promisify(jwt.verify)(
      req.get('Authorization').replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
  } catch (err) {
    err = new Error();
    err.message = 'wrong token';
    return res.status(400).json({ error: err.message });
  }
  const logins = await db.query(
    'SELECT counter_logins FROM counters WHERE user_id =?',
    [who.id]
  );
  res.json({ counter_logins: who.id });
};

module.exports = { counter_logins };
