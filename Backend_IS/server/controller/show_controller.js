require('dotenv').config();
const RssParser = require('rss-parser');
const rssparser = new RssParser();
const { jwtwrap } = require('../util/jwt');
const uuid = require('uuid');
const Redis = require('../util/cache');
const showModel = require('../model/show_model');
const cru = require('../model/cru_model');

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
  const hostNewepi = await showModel.newEpi();
  const hostPush1 = await showModel.rssLike(`%${hostNewepi[0].show_id}%`);
  const hostPush2 = await showModel.rssLike(`%${hostNewepi[1].show_id}%`);
  const showlistNewhost = await showModel.listNewHost(
    hostPush1[0].rss_id,
    hostPush2[0].rss_id,
    explicit
  );
  showlistNewhost.splice(Math.floor(Math.random() * 4), 0, hostPush1[0]);
  showlistNewhost.splice(Math.floor(Math.random() * 5), 0, hostPush2[0]);
  const showlistTop = await showModel.listTop(
    hostPush1[0].rss_id,
    hostPush2[0].rss_id,
    explicit
  );
  const showlistMiddle = await showModel.listMiddle(
    hostPush1[0].rss_id,
    hostPush2[0].rss_id,
    explicit
  );
  const data = {
    topic1: '熱門推薦',
    topic2: '隨機漫步',
    topic3: '探索新鮮',
    showlist_1: showlistTop,
    showlist_2: showlistMiddle,
    showlist_3: showlistNewhost,
  };
  return res.json(data);
};

const myshowpage = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const rss_id = await showModel.rssId(who.id);
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
  const showChoice = await cru.select('rss', ['rss_url', 'rss_hot'], {
    rss_id: id,
  });
  if (showChoice.length < 1) {
    return res.json({ status: 'RSS not in database' });
  }
  const hotPlus = showChoice[0].rss_hot + 1;
  await cru.update('rss', { rss_hot: hotPlus }, { rss_id: id });
  const url = showChoice[0].rss_url;
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
  const url = await cru.select('rss', ['rss_url'], { rss_id: show });
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
  const subCheck = await showModel.subCheck(who.id, req.body.id);
  if (subCheck[0]?.user_id) {
    return res.json({ status: 'already subscribed.' });
  }
  await cru.insert('subscribes', { user_id: who.id, rss_id: req.body.id });
  const searchName = await cru.select('creators_shows', ['show_name'], {
    show_id: req.body.id,
  });
  if (searchName.length > 0) {
    const subValue = await cru.select('creators_shows', ['show_subscriber'], {
      show_name: searchName[0].rss_title,
    });
    const subPlus = subValue[0].show_subscriber + 1;
    await cru.update(
      'creators_shows',
      { show_subscriber: subPlus },
      { show_name: searchName[0].rss_title }
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
  const unsubCheck = await showModel.subDel(who.id, req.body.id);
  if (unsubCheck.affectedRows === 0) {
    return res.status(200).json({ error: 'subscribe yet' });
  }
  const searchName = await cru.select('creators_shows', ['show_name'], {
    show_id: req.body.id,
  });

  if (searchName.length > 0) {
    const subValue = await cru.select('creators_shows', ['show_subscriber'], {
      show_name: searchName[0].rss_title,
    });
    const subMinus = subValue[0].show_subscriber - 1;
    await cru.update(
      'creators_shows',
      { show_subscriber: subMinus },
      { show_name: searchName[0].rss_title }
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

  if (req.body.type === 'show') {
    if (!req.body.show_id) {
      return res.status(200).json({ error: 'show id or status missing' });
    }
    let showStatusAfter = 0;
    const showStatusBefore = await cru.select(
      'creators_shows',
      ['show_status'],
      { show_id: req.body.show_id }
    );
    if (showStatusBefore[0].show_status === 1) {
      await cru.update(
        'creators_shows',
        { show_status: 0 },
        { show_id: req.body.show_id }
      );
      await showModel.rssStatus(req.body.show_id, 0);
    }
    if (showStatusBefore[0].show_status === 0) {
      await cru.update(
        'creators_shows',
        { show_status: 1 },
        { show_id: req.body.show_id }
      );
      await showModel.rssStatus(req.body.show_id, 1);
      showStatusAfter = 1;
    }
    const delCache = await showModel.delId(req.body.show_id);
    Redis.del(`${delCache[0].rss_id}`);
    return res.json({
      status: { type: req.body.type, status: showStatusAfter },
    });
  }
  if (req.body.type === 'episode') {
    if (!req.body.episode_id || !req.body.show_id) {
      return res.status(200).json({ error: 'episode id or status missing' });
    }
    let epistatus_after = 0;
    const epiStatusBefore = await cru.select('episodes', ['episode_status'], {
      episode_id: req.body.episode_id,
    });
    if (epiStatusBefore[0].episode_status === 1) {
      await cru.update(
        'episodes',
        { episode_status: 0 },
        { episode_id: req.body.episode_id }
      );
    }
    if (epiStatusBefore[0].episode_status === 0) {
      await cru.update(
        'episodes',
        { episode_status: 1 },
        { episode_id: req.body.episode_id }
      );

      epistatus_after = 1;
    }
    const delCache = await showModel.delId(req.body.show_id);
    Redis.del(`${delCache[0].rss_id}`);
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
  if (req.body.type === 'show') {
    const showInitialCheck = await showModel.initialCheck(
      who.id,
      req.body.show,
      'show_id'
    );
    if (!showInitialCheck[0]) {
      await cru.insert('history_shows', {
        user_id: who.id,
        show_id: req.body.show,
        clicks: 1,
      });
    } else {
      await showModel.historyClick(who.id, req.body.show);
    }
  }
  if (req.body.type === 'episode') {
    const epiInitialCheck = await showModel.initialCheck(
      who.id,
      req.body.episode,
      'episode_id'
    );
    if (!epiInitialCheck[0]) {
      await cru.insert('history_episodes', {
        user_id: who.id,
        show_id: req.body.show,
        episode_id: req.body.episode,
        clicks: 1,
      });
      await cru.update(
        'episodes',
        { episode_click: 1 },
        { episode_id: req.body.episode }
      );
    } else {
      await showModel.historyEpiClick(who.id, req.body.show, req.body.episode);
      await showModel.epiClick(req.body.episode);
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
  await cru.update(
    'episodes',
    { episode_status: 2 },
    { episode_id: targetepi }
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
  const episodeCheck = await showModel.epiCheck(
    info.show_id,
    info.episode_id,
    info.episode
  );

  if (episodeCheck[0]) {
    return res.status(200).json({ error: 'episode number already exist' });
  }
  try {
    const cdnimage = info.image.replace(
      `${process.env.S3_ORIGIN}`,
      `${process.env.CDN}/resize`
    );
    const cdnfile = info.file.replace(
      `${process.env.S3_ORIGIN}`,
      `${process.env.CDN}`
    );

    await cru.insert('episodes', {
      show_id: info.show_id,
      episode_id: epi_id,
      episode_title: info.title,
      episode_des: info.des,
      episode_file: cdnfile,
      episode_duration: info.duration,
      episode_length: info.length,
      episode_explicit: info.explicit,
      episode_image: cdnimage,
      episode_season: 1,
      episode_episode: info.episode,
      episode_status: 1,
    });
  } catch (err) {
    const message = err.sqlMessage + '(uuid)';
    return res.status(200).json({ error: message });
  }
  const allEpi = await cru.select('episodes', ['*'], { show_id: info.show_id });
  const delCache = await showModel.delId(info.show_id);
  Redis.del(`${delCache[0].rss_id}`);
  res.send(allEpi);
};

const ishostshow = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const showId = await cru.select('creators_shows', ['show_id'], {
    user_id: who.id,
  });
  const hostEpisode = await showModel.hostEpi(showId[0].show_id);
  if (!hostEpisode[0]) {
    return res.send([]);
  }
  return res.send(hostEpisode);
};

const historylist = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const history = await showModel.historyShow(who.id);
  res.send(history);
};

const sublist = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  const sub = await cru.select('subscribes', ['rss_id'], { user_id: who.id });
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
  const subShows = await showModel.subShow(who.id);
  res.send(subShows);
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
