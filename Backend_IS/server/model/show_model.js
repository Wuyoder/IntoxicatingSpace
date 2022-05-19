const db = require('../util/db');

const newEpi = async () => {
  try {
    const [result] = await db.query(
      'SELECT show_id, max(episode_publish_date) FROM episodes group by show_id ORDER BY max(episode_publish_date) DESC limit 2'
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.newEpi )' };
  }
};
const rssLike = async (showId) => {
  try {
    const [result] = await db.query('SELECT * FROM rss WHERE rss_url LIKE ?', [
      showId,
    ]);
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.rssLike )' };
  }
};
const rssStatus = async (showId, status) => {
  try {
    const [result] = await db.query(
      'UPDATE rss SET rss_status = ? WHERE rss_url LIKE ?',
      [status, `%${showId}%`]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.rssStatus )' };
  }
};

const listNewHost = async (rssId1, rssId2, explicit) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM rss WHERE rss_id IN (SELECT rss_id FROM rss WHERE ${explicit} rss_status = 1 AND rss_hot < ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) ORDER BY RAND() LIMIT 4 ;`,
      [rssId1, rssId2]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.listNewHost )' };
  }
};
const listTop = async (rssId1, rssId2, explicit) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM rss WHERE  ${explicit}  rss_id IN (SELECT rss_id FROM rss WHERE rss_explicit = 0 AND rss_status = 1 AND rss_hot > (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32 AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) ORDER BY RAND() LIMIT 6;`,
      [rssId1, rssId2]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.listTop )' };
  }
};

const listMiddle = async (rssId1, rssId2, explicit) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM rss WHERE  ${explicit}  rss_id IN (SELECT rss_id FROM rss WHERE rss_explicit = 0 AND rss_status = 1 AND rss_hot BETWEEN ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32  AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) ORDER BY RAND() LIMIT 6;`,
      [rssId1, rssId2]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.listMiddle )' };
  }
};
const rssId = async (id) => {
  try {
    const [result] = await db.query(
      'SELECT a.rss_id FROM rss AS a RIGHT JOIN creators_shows AS b ON a.rss_title = b.show_name WHERE b.user_id = ?',
      [id]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.rssId )' };
  }
};
const subCheck = async (id, epiId) => {
  try {
    const [result] = await db.query(
      'SELECT user_id FROM subscribes WHERE user_id = ? && rss_id = ?',
      [id, epiId]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.subCheck )' };
  }
};
const subDel = async (id, showId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM intoxicating.subscribes WHERE user_id = ? && rss_id = ?;',
      [id, showId]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.subDel )' };
  }
};

const delId = async (id) => {
  try {
    const [result] = await db.query(
      'SELECT rss_id FROM rss WHERE rss_url like ?',
      [`%${id}%`]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.delId )' };
  }
};
const initialCheck = async (id, target, type) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM history_shows WHERE user_id = ? && show_id = ?`,
      [id, target]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.initialCheck )' };
  }
};

const historyClick = async (id, showId) => {
  try {
    const [result] = await db.query(
      'UPDATE history_shows SET clicks = clicks + 1 WHERE user_id = ? && show_id = ?',
      [id, showId]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.historyClick )' };
  }
};
const historyEpiClick = async (id, show, epi) => {
  try {
    const [result] = await db.query(
      'UPDATE history_episodes SET clicks = clicks + 1 WHERE user_id = ? && show_id = ? && episode_id = ?',
      [id, show, epi]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.historyEpiClick )' };
  }
};
const epiClick = async (epiId) => {
  try {
    const [result] = await db.query(
      'UPDATE episodes SET episode_click = episode_click + 1 WHERE episode_id = ?',
      [epiId]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.epiClick )' };
  }
};

const epiCheck = async (showId, epiId, epiNum) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM episodes WHERE show_id = ? && episode_id = ? && episode_episode = ?',
      [showId, epiId, epiNum]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.epiCheck )' };
  }
};
const hostEpi = async (showId) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM episodes WHERE show_id = ? AND episode_status = 1 OR episode_status = 0 ORDER BY episode_publish_date DESC',
      [showId]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.hostEpi )' };
  }
};
const historyShow = async (id) => {
  try {
    const [result] = await db.query(
      'SELECT a.* , b.* FROM history_shows AS a RIGHT JOIN rss AS b ON a.show_id = b.rss_id WHERE user_id = ? ORDER BY a.time_click DESC LIMIT 12',
      [id]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.historyShow )' };
  }
};

const subShow = async (id) => {
  try {
    const [result] = await db.query(
      'SELECT a.* FROM rss AS a RIGHT JOIN subscribes AS b ON a.rss_id = b.rss_id WHERE b.user_id = ?',
      [id]
    );
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( show_model.subShow )' };
  }
};

const showModel = {
  newEpi,
  rssLike,
  rssStatus,
  listNewHost,
  listTop,
  listMiddle,
  rssId,
  subCheck,
  subDel,
  delId,
  initialCheck,
  historyClick,
  historyEpiClick,
  epiClick,
  epiCheck,
  hostEpi,
  historyShow,
  subShow,
};
module.exports = showModel;
