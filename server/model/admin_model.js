const db = require('../util/mysql');

const newrss = async (insertrss) => {
  await db.query(
    `INSERT INTO rss (rss_url, rss_title, rss_creator, rss_image, rss_explicit, rss_category_main, rss_category_sub, rss_hot) VALUES ${insertrss};`
  );
};
module.exports = { newrss };
