const db = require('../util/db');
const cru = require('./cru_model');
const newrss = async (rssInfo) => {
  try {
    await db.query(
      `INSERT INTO rss ( rss_title, rss_url, rss_creator, rss_image, rss_explicit, rss_category_main, rss_category_sub, rss_hot, rss_status) VALUES (?,?,?,?,?,?,?,?,?);`,
      [rssInfo]
    );
  } catch (err) {
    err = new Error();
    return { error: 'Server Error (DB)' };
  }
  return { status: 'OK' };
};

const urlcheck = async (url) => {
  try {
    const check = await cru.select('rss', ['rss_id'], { rss_url: url });
    if (check.length !== 0) {
      throw err;
    }
    return { status: 'OK' };
  } catch (err) {
    err = new Error();
    return { error: "RSS Feed's URL Already Exist." };
  }
};
module.exports = { newrss, urlcheck };
