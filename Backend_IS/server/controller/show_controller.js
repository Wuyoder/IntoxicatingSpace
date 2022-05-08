const db = require('../util/mysql');
const RssParser = require('rss-parser');
const rssparser = new RssParser();
const { jwtwrap } = require('../util/jwt');
const uuid = require('uuid');
const Redis = require('../util/cache');
const showlist = async (req, res) => {
  const who = await jwtwrap(req);
  let explicit = '';
  if (who.error) {
    explicit = '';
  } else {
    if (who.adult === 0) {
      explicit = 'rss_explicit = 0 AND ';
    } else {
      explicit = '';
    }
  }

  const [host_newepi] = await db.query(
    'SELECT show_id FROM episodes ORDER BY episode_publish_date DESC LIMIT 2'
  );
  const [host__push1] = await db.query(
    'SELECT * FROM rss WHERE rss_url LIKE ?',
    [`%${host_newepi[0].show_id}%`]
  );
  const [host__push2] = await db.query(
    'SELECT * FROM rss WHERE rss_url LIKE ?',
    [`%${host_newepi[1].show_id}%`]
  );
  const [showlist_unsub_newhost] = await db.query(
    `SELECT * FROM rss WHERE rss_id IN (SELECT rss_id FROM rss WHERE ${explicit} rss_status = 1 AND rss_hot < ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) ORDER BY RAND() LIMIT 4 ;`,
    [host__push1[0].rss_id, host__push2[0].rss_id]
  );

  showlist_unsub_newhost.splice(
    Math.floor(Math.random() * 4),
    0,
    host__push1[0]
  );
  showlist_unsub_newhost.splice(
    Math.floor(Math.random() * 5),
    0,
    host__push2[0]
  );
  //區間
  //(31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32
  //((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2
  const [showlist_random_hot] = await db.query(
    `SELECT * FROM rss WHERE  ${explicit}  rss_id IN (SELECT rss_id FROM rss WHERE rss_explicit = 0 AND rss_status = 1 AND rss_hot > (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32 AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) ORDER BY RAND() LIMIT 6;`,
    [host__push1[0].rss_id, host__push2[0].rss_id]
  );
  const [showlist_sub_randomwalk] = await db.query(
    `SELECT * FROM rss WHERE  ${explicit}  rss_id IN (SELECT rss_id FROM rss WHERE rss_explicit = 0 AND rss_status = 1 AND rss_hot BETWEEN ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32  AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) ORDER BY RAND() LIMIT 6;`,
    [host__push1[0].rss_id, host__push2[0].rss_id]
  );
  const data = {
    topic1: '熱門推薦',
    topic2: '隨機漫步',
    topic3: '探索新鮮',
    showlist_1: showlist_random_hot,
    showlist_2: showlist_sub_randomwalk,
    showlist_3: showlist_unsub_newhost,
  };
  return res.json(data);

  // const [host_newepi] = await db.query(
  //   'SELECT show_id FROM episodes ORDER BY episode_publish_date DESC LIMIT 2'
  // );
  // const [host__push1] = await db.query(
  //   'SELECT * FROM rss WHERE rss_url LIKE ?',
  //   [`%${host_newepi[0].show_id}%`]
  // );
  // const [host__push2] = await db.query(
  //   'SELECT * FROM rss WHERE rss_url LIKE ?',
  //   [`%${host_newepi[1].show_id}%`]
  // );
  // const [showlist_unsub_newhost] = await db.query(
  //   `SELECT * FROM rss WHERE rss_id IN (SELECT rss_id FROM rss WHERE ${explicit}  rss_status = 1  AND rss_hot < ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) order by RAND() LIMIT 4 ;`,
  //   [host__push1[0].rss_id, host__push2[0].rss_id]
  // );
  // showlist_unsub_newhost.splice(
  //   Math.floor(Math.random() * 4),
  //   0,
  //   host__push1[0]
  // );
  // showlist_unsub_newhost.splice(
  //   Math.floor(Math.random() * 5),
  //   0,
  //   host__push2[0]
  // );

  // const [showlist_random_hot] = await db.query(
  //   `SELECT * FROM rss WHERE rss_id IN (SELECT rss_id FROM rss WHERE  ${explicit}  rss_status = 1 AND rss_hot > (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32 AND rss_id <> ? AND rss_id <> ? ORDER BY rss_hot DESC) order by RAND() LIMIT 6;`,
  //   [host__push1[0].rss_id, host__push2[0].rss_id]
  // );
  // let excepthot = '';
  // for (let i = 0; i < 6; i++) {
  //   excepthot += ` rss_id <> ${showlist_random_hot[i].rss_id}  AND `;
  //   excepthot += ` rss_id <>  ${showlist_unsub_newhost[i].rss_id} AND  `;
  // }

  // const [history_category] = await db.query(
  //   `SELECT rss_id FROM subscribes WHERE user_id = ? `,
  //   [who.id]
  // );

  //要去除前兩個的show_id
  //先取得hot rss_id
  //再取得探索新鮮的 rss_id
  // let showlist_by_relate = [];
  // let exceptrelate = '';
  // if (history_category.length !== 0) {
  //   let category_relate = '';
  //   for (let i = 0; i < history_category.length; i++) {
  //     category_relate += 'rss_id =' + history_category[i].rss_id + '||';
  //   }
  //   category_relate = category_relate.slice(0, category_relate.length - 2);
  //   const [category] = await db.query(
  //     `SELECT DISTINCT rss_category_main FROM rss  WHERE  ` + category_relate
  //   );
  //   category_hot = '';
  //   for (let i = 0; i < category.length; i++) {
  //     category_hot +=
  //       `rss_category_main = ` + `'${category[i].rss_category_main}'` + ' ||';
  //   }
  //   category_hot = category_hot.slice(0, category_hot.length - 2);
  //   [showlist_by_relate] = await db.query(
  //     `SELECT * FROM rss WHERE ` +
  //       category_hot +
  //       `AND  ${explicit} ${excepthot}  rss_hot BETWEEN ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32  ORDER BY RAND() DESC LIMIT 6`
  //   );
  //   if (showlist_by_relate.length < 6) {
  //     for (let i = 0; i < showlist_by_relate.length; i++) {
  //       exceptrelate += `rss_id <> ${showlist_by_relate[i].rss_id}  AND  `;
  //     }
  //   }
  // } else {
  //   showlist_by_relate = [];
  // }

  // const [add] = await db.query(
  //   `SELECT * FROM rss WHERE ${explicit} ${excepthot}  ${exceptrelate} rss_hot BETWEEN ((SELECT AVG(rss_hot) FROM rss)+(SELECT MIN(rss_hot) FROM rss))/2 AND (31*(SELECT AVG(rss_hot) FROM rss)+(SELECT MAX(rss_hot) FROM rss))/32   ORDER BY RAND() DESC LIMIT ?`,
  //   [6 - showlist_by_relate.length]
  // );
  // const addnum = 6 - showlist_by_relate.length;
  // for (let i = 0; i < addnum; i++) {
  //   showlist_by_relate.push(add[i]);
  // }
  // console.log('hot show');
  // for (let i = 0; i < 6; i++) {
  //   console.log(showlist_random_hot[i].rss_id);
  // }
  // console.log('relate show');
  // for (let i = 0; i < 6; i++) {
  //   console.log(showlist_by_relate[i].rss_id);
  // }
  // const data = {
  //   topic1: '熱門推薦',
  //   topic2: '鼓腹而遊',
  //   topic3: '探索新鮮',
  //   showlist_1: showlist_random_hot,
  //   showlist_2: showlist_by_relate,
  //   showlist_3: showlist_unsub_newhost,
  // };
  // res.json(data);
};

const myshowpage = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const [rss_id] = await db.query(
    'SELECT a.rss_id FROM rss AS a RIGHT JOIN creators_shows AS b ON a.rss_title = b.show_name WHERE b.user_id = ?',
    [who.id]
  );
  res.json({ rss_id: rss_id[0].rss_id });
};

const showchoice = async (req, res) => {
  var timer = -performance.now();
  const id = req.params.id;
  const cache = await Redis.get(`${id}`);
  if (cache !== null) {
    timer += performance.now();
    console.log('Cache Time: ' + (timer / 1000).toFixed(5) + ' sec.');
    return res.send(JSON.parse(cache));
  }

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
  Redis.set(`${id}`, JSON.stringify(rssObject));
  Redis.expire(`${id}`, 7200);
  timer += performance.now();
  console.log('No Cache Time: ' + (timer / 1000).toFixed(5) + ' sec.');
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
  const [searchname] = await db.query(
    'SELECT rss_title FROM rss WHERE rss_id = ?',
    [req.body.id]
  );
  if (searchname[0].rss_title) {
    const [result] = await db.query(
      'UPDATE creators_shows SET show_subscriber = show_subscriber+1 WHERE show_name = ? ',
      [searchname[0].rss_title]
    );
    return res.json({ status: 'subscribe IS host show ok' });
  } else {
    return res.json({ status: 'subscribe outsite host show ok' });
  }
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

  const [searchname] = await db.query(
    'SELECT rss_title FROM rss WHERE rss_id = ?',
    [req.body.id]
  );

  if (searchname[0].rss_title) {
    const [result] = await db.query(
      'UPDATE creators_shows SET show_subscriber = show_subscriber-1 WHERE show_name = ? ',
      [searchname[0].rss_title]
    );
    return res.json({ status: 'unsubscribe IS host show ok' });
  } else {
    return res.json({ status: 'unsubscribe outsite host show ok' });
  }
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
  //TODO:要直接修改DB rss 的show_status
  if (req.body.type === 'show') {
    console.log('req.body.show_id', req.body.show_id);
    if (!req.body.show_id) {
      return res.status(200).json({ error: 'show id or status missing' });
    }
    let showstatus_after = 0;
    const [status_before] = await db.query(
      'SELECT show_status FROM creators_shows WHERE show_id = ?',
      [req.body.show_id]
    );
    if (status_before[0].show_status === 1) {
      [result] = await db.query(
        'UPDATE creators_shows SET show_status = 0 WHERE show_id = ?',
        [req.body.show_id]
      );
      const rss = await db.query(
        'UPDATE rss SET rss_status = 0 WHERE rss_url LIKE ?',
        [`%${req.body.show_id}%`]
      );
      console.log('rss', rss);
    }
    if (status_before[0].show_status === 0) {
      [result] = await db.query(
        'UPDATE creators_shows SET show_status = 1 WHERE show_id = ?',
        [req.body.show_id]
      );
      const rss2 = await db.query(
        'UPDATE rss SET rss_status = 1 WHERE rss_url LIKE ?',
        [`%${req.body.show_id}%`]
      );
      console.log('rss2', rss2);
      showstatus_after = 1;
    }
    return res.json({
      status: { type: req.body.type, status: showstatus_after },
    });
  }
  if (req.body.type === 'episode') {
    if (!req.body.episode_id || !req.body.show_id) {
      return res.status(200).json({ error: 'episode id or status missing' });
    }
    let epistatus_after = 0;
    const [status_before] = await db.query(
      'SELECT episode_status FROM episodes WHERE show_id = ? AND episode_id = ?',
      [req.body.show_id, req.body.episode_id]
    );
    if (status_before[0].episode_status === 1) {
      [result] = await db.query(
        'UPDATE episodes SET episode_status = 0 WHERE show_id = ? AND episode_id = ?',
        [req.body.show_id, req.body.episode_id]
      );
    }
    if (status_before[0].episode_status === 0) {
      [result] = await db.query(
        'UPDATE episodes SET episode_status = 1 WHERE show_id = ? AND episode_id = ?',
        [req.body.show_id, req.body.episode_id]
      );
      epistatus_after = 1;
    }
    res.json({ status: { type: req.body.type, status: epistatus_after } });
  }
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
      const epiclick = await db.query(
        'UPDATE episodes SET episode_click = 1 WHERE episode_id = ?',
        [req.body.episode]
      );
    } else {
      result = await db.query(
        'UPDATE history_episodes SET clicks = clicks + 1 WHERE user_id = ? && show_id = ? && episode_id = ?',
        [who.id, req.body.show, req.body.episode]
      );
      const epiclick = await db.query(
        'UPDATE episodes SET episode_click = episode_click + 1 WHERE episode_id = ?',
        [req.body.episode]
      );
    }
  }
  res.status(200).json({ status: { type: req.body.type } });
};
const episoderemove = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const targetepi = req.body.episode_id;
  const [showclose] = await db.query(
    'UPDATE episodes SET episode_status = 2 WHERE episode_id = ? ',
    [targetepi]
  );
  res.json({ status: `episode ${req.body.episode_id} already removed.` });
};

const episode = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const info = req.body;
  const epi_id = uuid.v4();
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
        epi_id,
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

  const [allepi] = await db.query('SELECT * FROM episodes WHERE show_id = ?', [
    info.show_id,
  ]);

  res.send(allepi);
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
    'SELECT * FROM episodes WHERE show_id = ? AND episode_status = 1 OR episode_status = 0 ORDER BY episode_publish_date DESC',
    [show_id[0].show_id]
  );
  if (!host_episode[0]) {
    return res.send([]);
  }
  return res.send(host_episode);
};

const historylist = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const [history] = await db.query(
    'SELECT a.* , b.* FROM history_shows AS a RIGHT JOIN rss AS b ON a.show_id = b.rss_id WHERE user_id = ? ORDER BY a.time_click DESC LIMIT 12',
    [who.id]
  );

  res.send(history);
};

const sublist = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const [sub] = await db.query(
    'SELECT rss_id FROM subscribes WHERE user_id = ?',
    [who.id]
  );
  let list = [];
  for (let i = 0; i < sub.length; i++) {
    list.push(sub[i].rss_id);
  }
  res.send(list);
};

const subshows = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const [subshows] = await db.query(
    'SELECT a.* FROM rss AS a RIGHT JOIN subscribes AS b ON a.rss_id = b.rss_id WHERE b.user_id = ?',
    [who.id]
  );

  res.send(subshows);
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
  historylist,
  sublist,
  subshows,
  myshowpage,
  episoderemove,
};
