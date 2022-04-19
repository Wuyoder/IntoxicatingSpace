const db = require('../util/mysql');
const RssParser = require('rss-parser');
const rssparser = new RssParser();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { jwtwrap } = require('../util/jwt');

const showlist = async (req, res) => {
  const [showlist_by_hot] = await db.query(
    'SELECT * FROM intoxicating.rss WHERE rss_explicit=0 AND rss_status=1 order by rss_hot desc limit 6;'
  );
  res.json(showlist_by_hot);
};

const showchoice = async (req, res) => {
  const id = req.params.id;
  const [show_choice] = await db.query(
    'SELECT rss_url FROM rss WHERE rss_id = ?',
    [id]
  );
  await db.query('UPDATE rss SET rss_value = rss_value+1 WHERE rss_id = ?', [
    id,
  ]);
  await db.query('UPDATE rss SET rss_hot = rss_hot+1 WHERE rss_id = ?', [id]);

  const url = show_choice[0].rss_url;
  try {
    rssObject = await rssparser.parseURL(url);
  } catch (err) {
    err = new Error();
    err.message = 'wrong rss url';
    return res.send(err);
  }
  console.log(rssObject.title);
  res.send(rssObject);
};

const episodechoice = async (req, res) => {
  const show_episode = req.params.episode;
  const split = show_episode.split('-');
  const show = split[0];
  const episode = split[1];
  const [url] = await db.query('SELECT rss_url FROM rss WHERE rss_id = ?', [
    show,
  ]);
  if (!url[0]) {
    return res.send('wrong show info.');
  }
  rssObject = await rssparser.parseURL(url[0].rss_url);
  data = {
    title: rssObject.title,
    category: rssObject.itunes.categories[0],
    author: rssObject.itunes.author,
    item: rssObject.items[episode],
  };
  res.send(data);
};

const showsubscribe = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.id) {
    return res.status(400).json({ error: 'show id missing' });
  }
  const [sub_check] = await db.query(
    'SELECT user_id FROM subscribes WHERE user_id = ? && rss_id = ?',
    [who.id, req.body.id]
  );
  if (sub_check[0]?.user_id) {
    return res.json({ message: 'already subscribed.' });
  }
  await db.query('INSERT INTO subscribes (user_id, rss_id) VALUES (?,?)', [
    who.id,
    req.body.id,
  ]);
  res.send('subscribe ok');
};

const showunsub = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.id) {
    return res.status(400).json({ error: 'show id missing' });
  }
  const [unsub_check] = await db.query(
    'DELETE FROM intoxicating.subscribes WHERE user_id = ? && rss_id = ?;',
    [who.id, req.body.id]
  );
  if (unsub_check.affectedRows === 0) {
    return res.status(400).json({ error: 'subscribe yet' });
  }
  console.log(unsub_check.affectedRows);

  res.send('unsubcribe OK');
};

const showswitcher = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.id || !req.body.status) {
    return res.status(400).json({ error: 'show id missing' });
  }
  const [showswitcheon] = await db.query(
    'UPDATE creators_shows SET show_status = ? WHERE user_id = ?',
    [req.body.status, who.id]
  );
  res.status(200).json({ 'status change': req.body.status });
};
//TODO: new episode first
const episodeswitcher = async (req, res) => {
  res.send('OK');
};

const userhistory = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.type) {
    return res.status(400).json({ error: 'type missing' });
  }
  let result;
  if (req.body.type === 'show') {
    const [show_initial_check] = await db.query(
      'SELECT * FROM history_shows WHERE user_id = ? && show_id = ?',
      [who.id, req.body.show]
    );
    if (!show_initial_check[0]) {
      result = await db.query(
        'INSERT INTO history_shows (user_id, show_id, clicks) VALUES (?, ?, ?)',
        [who.id, req.body.show, 1]
      );
    } else {
      result = await db.query(
        'UPDATE history_shows SET clicks = clicks + 1 WHERE user_id = ? && show_id = ?',
        [who.id, req.body.show]
      );
    }
  }

  if (req.body.type === 'episode') {
    const [episode_initial_check] = await db.query(
      'SELECT * FROM history_episodes WHERE user_id = ? && show_id = ? && episode_id = ?',
      [who.id, req.body.show, req.body.episode]
    );
    if (!episode_initial_check[0]) {
      result = await db.query(
        'INSERT INTO history_episodes (user_id, show_id, episode_id, clicks) VALUES (?, ?, ?, ?)',
        [who.id, req.body.show, req.body.episode, 1]
      );
    } else {
      result = await db.query(
        'UPDATE history_episodes SET clicks = clicks + 1 WHERE user_id = ? && show_id = ? && episode_id = ?',
        [who.id, req.body.show, req.body.episode]
      );
    }
  }
  res.status(200).json({ 'history update': req.body.type });
};

module.exports = {
  showlist,
  showchoice,
  episodechoice,
  showsubscribe,
  showunsub,
  showswitcher,
  episodeswitcher,
  userhistory,
};
