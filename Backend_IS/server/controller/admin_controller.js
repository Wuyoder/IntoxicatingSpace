const RssParser = require('rss-parser');
const rssparser = new RssParser();
const mysql = require('../model/admin_model');

const newrss = async (req, res) => {
  let insert = '';
  const { rsslist } = req.body;
  let rssObject;
  for (let i = 0; i < rsslist.length; i++) {
    const rss = rsslist[i];
    rssObject = await rssparser.parseURL(rss);

    const title = rssObject.title;
    const url = rssObject.feedUrl;
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
    insert += `("${title}","${url}","${creator}","${image}",${explicit},"${category_main}","${category_sub}","${hot}", 1),`;
    console.log(title);
  }
  const insertAll = insert.slice(0, insert.length - 1);
  mysql.newrss(insertAll);

  res.json({ status: 'new rss insert to DB OK' });
};
module.exports = { newrss };
