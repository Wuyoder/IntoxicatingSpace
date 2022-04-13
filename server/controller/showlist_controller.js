const db = require('../util/mysql');
const showlist = async (req, res) => {
  const [showlist_by_hot] = await db.query(
    'SELECT * FROM intoxicating.rss WHERE rss_explicit=0 AND rss_status=1 order by rss_hot desc limit 18;'
  );
  res.json(showlist_by_hot);
};
module.exports = { showlist };
