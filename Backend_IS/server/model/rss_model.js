const db = require('../util/db');
const rssEpi = async (id) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM episodes WHERE show_id = ? && episode_status = 1 ORDER BY episode_publish_date DESC',
      [id]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( rss_model.rssEpi )' };
  }
};
module.exports = { rssEpi };
