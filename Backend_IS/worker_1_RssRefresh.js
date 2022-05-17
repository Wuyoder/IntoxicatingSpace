require('dotenv').config();
const mysql2 = require('mysql2');
const pool = mysql2.createPool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PWD,
  database: process.env.RDS_DB,
  waitForConnections: true,
  connectionLimit: 10,
});
const db = pool.promise();
const RssParser = require('rss-parser');
const rssparser = new RssParser();

function worker() {
  var timer = -performance.now();
  console.log('====START UPDATE RSS FEED====');
  const workerGo = async () => {
    const [allRssInDb] = await db.query('SELECT rss_url FROM rss');
    for (let i = 0; i < allRssInDb.length; i++) {
      try {
        rssObject = await rssparser.parseURL(allRssInDb[i].rss_url);

        const title = rssObject.title;
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
        if (
          title === undefined ||
          image === undefined ||
          creator === undefined ||
          explicit === undefined
        ) {
          await db.query('UPDATE rss SET rss_status = 0 WHERE rss_url = ? ', [
            allRssInDb[i].rss_url,
          ]);
          console.log(`${i}-${allRssInDb[i].rss_url} URL DEAD (Info Missing).`);
        } else {
          await db.query(
            'UPDATE rss SET rss_title = ?, rss_creator = ?, rss_image = ?, rss_explicit = ?, rss_category_main = ?, rss_category_sub = ? WHERE rss_url = ?',
            [
              title,
              creator,
              image,
              explicit,
              category_main,
              category_sub,
              allRssInDb[i].rss_url,
            ]
          );
          console.log(`${i}-${title} update OK!`);
        }
      } catch (err) {
        await db.query('UPDATE rss SET rss_status = 0 WHERE rss_url = ? ', [
          allRssInDb[i].rss_url,
        ]);
        console.log(`${i}-${allRssInDb[i].rss_url} URL DEAD (Parse ERROR).`);
      }
    }
    await db.end();
    timer += performance.now();
    console.log('Total Update Time: ' + (timer / 1000).toFixed(5) + ' sec.');
    console.log('====RSS FEED UPDATE END====');
  };
  workerGo();
}
worker();
