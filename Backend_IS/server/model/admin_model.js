const db = require('../util/db');
const cru = require('./cru_model');
const newRssURL = async (rssInfo) => {
  try {
    await db.query(
      'INSERT INTO rss ( rss_title, rss_url, rss_creator, rss_image, rss_explicit, rss_category_main, rss_category_sub, rss_hot, rss_status) VALUES (?,?,?,?,?,?,?,?,?)',
      rssInfo
    );
    return;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( admin_model.newRss )' };
  }
};

const urlCheck = async (url) => {
  try {
    const check = await cru.select('rss', ['rss_id'], { rss_url: url });
    if (check.length !== 0) {
      throw { error: 'rss already exist.' };
    }
    return check;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( admin_model.urlCheck )' };
  }
};
module.exports = { newRssURL, urlCheck };
