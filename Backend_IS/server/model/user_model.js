const db = require('../util/db');

const newEpi = async (showId, epiId) => {
  try {
    await db.query(
      'SELECT * FROM episodes WHERE show_id = ? AND episode_id = ?;',
      [showId, epiId]
    );
    return;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( user_model.newEpi )' };
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
    console.error(err);
    return { error: 'db error ( user_model.updateRssInfo )' };
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
    console.error(err);
    return { error: 'db error ( user_model.updateNewEpi )' };
  }
};
const userModel = { newEpi, updateRssInfo, updateNewEpi };
module.exports = userModel;
