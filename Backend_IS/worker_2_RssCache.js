require('dotenv').config();
const redis = require('redis');
const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;
const Redis = redis.createClient({
  url: `redis://${CACHE_USER}:${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}`,
  socket: {
    keepAlive: false,
  },
});
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

Redis.ready = false;
Redis.connect();
Redis.on('ready', () => {
  Redis.ready = true;
  console.log('redis is ready');
});

Redis.on('error', (err) => {
  console.log('redis server error', err);
});

Redis.on('end', () => {
  Redis.ready = false;
  console.log('Redis is disconnected');
});

function worker() {
  var timer = -performance.now();
  const workerGo = async () => {
    console.log('=====START RSS TO CACHE====');
    const [allRssInDb] = await db.query(
      'SELECT rss_id, rss_title, rss_url FROM rss WHERE rss_status = 1'
    );
    for (let i = 0; i < allRssInDb.length; i++) {
      rssObject = await rssparser.parseURL(allRssInDb[i].rss_url);
      Redis.set(`${allRssInDb[i].rss_id}`, JSON.stringify(rssObject));
      Redis.expire(`${allRssInDb[i].rss_id}`, 7200);
      console.log(
        `${allRssInDb[i].rss_id} - ${allRssInDb[i].rss_title} Cached!`
      );
    }
    timer += performance.now();
    console.log('Total Cache Time: ' + (timer / 1000).toFixed(5) + ' sec.');
    console.log('=====UPDATE RSS CACHE END====');
    await db.end();
    await Redis.quit();
  };
  workerGo();
}
worker();
