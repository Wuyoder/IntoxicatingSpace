const db = require('../util/db');

const search = async (range, explicit, keyword) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM rss WHERE (' +
        range +
        ' like ? )' +
        explicit +
        'AND rss_status = 1',
      [`%${keyword}%`]
    );

    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( search_model.search )' };
  }
};

module.exports = { search };
