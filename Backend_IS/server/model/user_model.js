const db = require('../util/db');

const newEpi = async (showId, epiId) => {
  try {
    await db.query(
      'SELECT * FROM episodes WHERE show_id = ? AND episode_id = ?;',
      [showId, epiId]
    );
    return;
  } catch (err) {
    return { error: 'db error' };
  }
};

const updateRssInfo = async (column, newInfo, showId) => {
  try {
    await db.query(`UPDATE rss SET ${column} = ? WHERE rss_url LIKE ?`, [
      newInfo,
      `%${showId}%`,
    ]);
    return;
  } catch (err) {
    return { error: 'db error' };
  }
};

const updateNewEpi = async (column, newInfo, showId, epiId) => {
  try {
    await db.query(
      `UPDATE episodes SET ${column} = ? WHERE show_id = ? AND episode_id = ?`,
      [newInfo, showId, epiId]
    );
    return;
  } catch (err) {
    return { error: 'db error' };
  }
};
const userModel = { newEpi, updateRssInfo, updateNewEpi };
module.exports = userModel;
