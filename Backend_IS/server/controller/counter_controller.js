const db = require('../util/db');
const cru = require('../model/cru_model');
const { jwtwrap } = require('../util/jwt');

const counter_logins = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  const logins = await cru.select('counters', ['counter_logins'], {
    user_id: who.id,
  });
  res.json({ status: logins[0].counter_logins });
};

module.exports = { counter_logins };
