const db = require('../util/mysql');
const RssParser = require('rss-parser');
const rssparser = new RssParser();
const axios = require('axios');

const showlist = async (req, res) => {
  const [showlist_by_hot] = await db.query(
    'SELECT * FROM intoxicating.rss WHERE rss_explicit=0 AND rss_status=1 order by rss_hot desc limit 18;'
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
  rssObject = await rssparser.parseURL(url);
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

module.exports = { showlist, showchoice, episodechoice };
