const db = require('../util/mysql');
const jwt = require('jsonwebtoken');
const { jwtwrap } = require('../util/jwt');

const counter_logins = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  const [logins] = await db.query(
    'SELECT counter_logins FROM counters WHERE user_id =?',
    [who.id]
  );
  res.json({ status: logins[0].counter_logins });
};

module.exports = { counter_logins };
