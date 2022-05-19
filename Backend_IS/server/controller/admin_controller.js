const RssParser = require('rss-parser');
const rssparser = new RssParser();
const { newRssURL, urlCheck } = require('../model/admin_model');
const { jwtwrap } = require('../util/jwt');

const newRss = async (req, res) => {
  const who = await jwtwrap(req);
  let count = 0;
  // admin operation check
  if (who.error) {
    return res.status(401).json(who);
  }
  if (who.role !== 1) {
    return res.status(401).json({ error: 'Forbidden Operation.' });
  }
  try {
    if (req.body.rsslist.length < 1) {
      throw "No RSS Feed's URL ";
    }
    const { rsslist } = req.body;
    let rssObject;
    let rssInfo = [];
    for (let i = 0; i < rsslist.length; i++) {
      const rss = rsslist[i];
      try {
        rssObject = await rssparser.parseURL(rss);
      } catch (err) {
        throw 'Invalid URL, Please Check Input';
      }
      const title = rssObject.title;
      const url = rssObject.feedUrl;
      // No repeat podcast rss check
      const check = await urlCheck(url);
      if (!check.error) {
        count += 1;
        const image = rssObject.itunes.image;
        let creator;
        let explicit;
        let category_main;
        let category_sub;
        if (rssObject.items[0].creator) {
          creator = rssObject.items[0].creator;
        } else {
          creator = title;
        }
        if (rssObject.itunes.explicit === 'no') {
          explicit = 0;
        } else {
          explicit = 1;
        }
        if (rssObject.itunes.categoriesWithSubs) {
          category_main = rssObject.itunes.categoriesWithSubs[0].name;
          if (rssObject.itunes.categoriesWithSubs[0].subs) {
            category_sub = rssObject.itunes.categoriesWithSubs[0].subs[0].name;
          } else {
            category_sub = category_main;
          }
        } else {
          category_main = 'none';
          category_sub = 'none';
        }
        const hot = 1;
        rssInfo.push(
          title,
          url,
          creator,
          image,
          explicit,
          category_main,
          category_sub,
          hot,
          1
        );
      }
    }
    if (count === 0) {
      throw 'No New Feed.';
    }
    const result = await newRssURL(rssInfo);
    if (result.error) {
      throw result.error;
    }
  } catch (err) {
    return res.json({ error: err });
  }
  return res.status(200).json({
    status: `${count} new RSS insert to DB OK (${
      req.body.rsslist.length - count
    } RSS already exist)`,
  });
};

module.exports = { newRss };
