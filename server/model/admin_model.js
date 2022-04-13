const db = require('../util/mysql');

const newrss = async (insertrss) => {
  await db.query(
    `INSERT INTO rss ( rss_title, rss_url, rss_creator, rss_image, rss_explicit, rss_category_main, rss_category_sub, rss_hot, rss_status) VALUES ${insertrss};`
  );
};
module.exports = { newrss };
