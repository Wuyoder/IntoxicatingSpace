const db = require('../util/mysql');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const userprofile = async (req, res) => {
  let who;
  try {
    who = await promisify(jwt.verify)(
      req.get('Authorization').replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
  } catch (err) {
    err = new Error();
    err.message = 'wrong token';
    return res.status(200).json({ error: err.message });
  }
  res.send(who);
};

const creatorprofile = async (req, res) => {
  let who;
  try {
    who = await promisify(jwt.verify)(
      req.get('Authorization').replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
  } catch (err) {
    err = new Error();
    err.message = 'wrong token';
    return res.status(200).json({ error: err.message });
  }
  const [creator_profile] = await db.query(
    'SELECT * FROM creators_shows WHERE user_id = ?',
    [who.id]
  );

  res.send(creator_profile);
};

module.exports = { userprofile, creatorprofile };
