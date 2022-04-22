const db = require('../util/mysql');
const RssParser = require('rss-parser');
const rssparser = new RssParser();
const { jwtwrap } = require('../util/jwt');
const uuid = require('uuid');

const showlist = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    let topic = ['熱門推薦', '隨機漫步', '探索新鮮'];
    const [showlist_by_hot] = await db.query(
      'SELECT * FROM rss WHERE rss_explicit = 0 AND rss_status = 1 ORDER BY rss_hot DESC LIMIT 6;'
    );
    const [showlist_random1] = await db.query(
      'SELECT * FROM rss WHERE rss_explicit = 0 AND rss_status = 1  ORDER BY rss_hot LIMIT 6'
    );
    const [showlist_random2] = await db.query(
      'SELECT * FROM rss WHERE rss_hot < (SELECT AVG(rss_hot) FROM intoxicating.rss) LIMIT 6'
    );
    const data = {
      topic1: topic[0],
      topic2: topic[1],
      topic3: topic[2],
      showlist_1: showlist_by_hot,
      showlist_2: showlist_random1,
      showlist_3: showlist_random2,
    };
    return res.json(data);
  }

  //以下為有登入這  熱門點擊, 歷史記錄, 相關推薦
  let topic = ['熱門推薦', '歷史記錄', '探索新鮮'];
  //熱門點擊
  const [showlist_by_hot] = await db.query(
    'SELECT * FROM rss WHERE rss_status=1 order by rss_hot desc limit 6;'
  );
  //歷史記錄
  const [histroy_list] = await db.query(
    'SELECT show_id FROM history_shows WHERE user_id = ? ORDER BY time_click DESC LIMIT 6',
    [who.id]
  );
  let history_show_id = '';
  for (let i = 0; i < histroy_list.length; i++) {
    history_show_id += 'rss_id =' + histroy_list[i].show_id + '||';
  }
  history_show_id = history_show_id.slice(0, history_show_id.length - 2);
  const [showlist_by_history] = await db.query(
    'SELECT * FROM rss WHERE ' + history_show_id
  );
  //相關推薦（先找category 後by hot）
  const [history_category] = await db.query(
    'SELECT rss_id FROM subscribes WHERE user_id = ?',
    [who.id]
  );
  let category_relate = '';
  for (let i = 0; i < history_category.length; i++) {
    category_relate += 'rss_id =' + history_category[i].rss_id + '||';
  }
  category_relate = category_relate.slice(0, category_relate.length - 2);
  const [category] = await db.query(
    'SELECT DISTINCT rss_category_main FROM rss WHERE ' + category_relate
  );
  category_hot = '';
  for (let i = 0; i < category.length; i++) {
    category_hot +=
      `rss_category_main = ` + `'${category[i].rss_category_main}'` + ' ||';
  }
  category_hot = category_hot.slice(0, category_hot.length - 2);
  const [showlist_by_relate] = await db.query(
    'SELECT * FROM rss WHERE ' + category_hot + ' ORDER BY rss_hot DESC LIMIT 6'
  );
  const data = {
    topic1: topic[0],
    topic2: topic[1],
    topic3: topic[2],
    showlist_1: showlist_by_hot,
    showlist_2: showlist_by_history,
    showlist_3: showlist_by_relate,
  };
  res.json(data);
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
    return res.json({ error: err.message });
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
    return res.json({ error: 'wrong show info.' });
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
    return res.status(200).json({ error: 'show id missing' });
  }
  const [sub_check] = await db.query(
    'SELECT user_id FROM subscribes WHERE user_id = ? && rss_id = ?',
    [who.id, req.body.id]
  );
  if (sub_check[0]?.user_id) {
    return res.json({ status: 'already subscribed.' });
  }
  await db.query('INSERT INTO subscribes (user_id, rss_id) VALUES (?,?)', [
    who.id,
    req.body.id,
  ]);
  const [result] = await db.query(
    'UPDATE creators_shows SET show_subscriber = show_subscriber+1 WHERE show_id = ? ',
    [req.body.id]
  );
  if (result.affectedRows === 0) {
    return res.json({ status: 'subscribe outsite host show ok' });
  }
  res.send({ status: 'subscribe IS host show ok' });
};

const showunsub = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.id) {
    return res.status(200).json({ error: 'show id missing' });
  }
  const [unsub_check] = await db.query(
    'DELETE FROM intoxicating.subscribes WHERE user_id = ? && rss_id = ?;',
    [who.id, req.body.id]
  );
  if (unsub_check.affectedRows === 0) {
    return res.status(200).json({ error: 'subscribe yet' });
  }
  await db.query(
    'UPDATE creators_shows SET show_subscriber = show_subscriber-1 WHERE show_id = ?',
    [req.body.id]
  );

  res.send('unsubcribe OK');
};

const switcher = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.type) {
    return res.status(200).json({ error: 'type missing' });
  }
  let result;
  if (req.body.type === 'show') {
    if (!req.body.id || !req.body.status) {
      return res.status(200).json({ error: 'show id or status missing' });
    }
    [result] = await db.query(
      'UPDATE creators_shows SET show_status = ? WHERE user_id = ?',
      [req.body.status, who.id]
    );
  }
  if (req.body.type === 'episode') {
    if (!req.body.id || !req.body.status) {
      return res.status(200).json({ error: 'episode id or status missing' });
    }
    [result] = await db.query(
      'UPDATE episodes SET episode_status = ? WHERE user_id = ?',
      [req.body.status, who.id]
    );
  }
  if (result.affectedRows === 0) {
    return res.status(200).json({ error: 'wrong id, please check input' });
  }
  res
    .status(200)
    .json({ status: { type: req.body.type, record: req.body.status } });
};

const userhistory = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  if (!req.body.type) {
    return res.status(200).json({ error: 'type missing' });
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
  res.status(200).json({ status: { type: req.body.type } });
};

const episode = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const info = req.body;

  const [episode_check] = await db.query(
    'SELECT * FROM episodes WHERE show_id = ? && episode_id = ? && episode_episode = ?',
    [info.show_id, info.episode_id, info.episode]
  );
  if (episode_check[0]) {
    return res.status(200).json({ error: 'episode number already exist' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO episodes (show_id, episode_id, episode_title, episode_des, episode_file, episode_duration, episode_length, episode_explicit, episode_image, episode_season, episode_episode, episode_status) ' +
        'VALUES (?, ? ,?, ?, ?, ?, ?, ?, ?, 1, ?, 1 )',
      [
        info.show_id,
        uuid.v4(),
        info.title,
        info.des,
        info.file,
        info.duration,
        info.length,
        info.explicit,
        info.image,
        info.episode,
      ]
    );
  } catch (err) {
    const message = err.sqlMessage + '(uuid)';
    return res.status(200).json({ error: message });
  }

  res.json({ status: 'episode update ok & status = 1' });
};

const ishostshow = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }

  const [show_id] = await db.query(
    'SELECT show_id FROM creators_shows WHERE user_id = ?',
    [who.id]
  );
  const [host_episode] = await db.query(
    'SELECT * FROM episodes WHERE show_id = ?',
    [show_id[0].show_id]
  );
  if (!host_episode[0]) {
    return res.json({ error: 'no episode found' });
  }
  return res.send(host_episode);
  res.json(who);
};

module.exports = {
  showlist,
  showchoice,
  episodechoice,
  showsubscribe,
  showunsub,
  switcher,
  userhistory,
  episode,
  ishostshow,
};
