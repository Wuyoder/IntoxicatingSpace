require('dotenv').config();
const redis = require('redis');
const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;

const redisClient = redis.createClient({
  url: `redis://${CACHE_USER}:${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}`,
  socket: {
    keepAlive: false,
  },
});

redisClient.ready = false;
redisClient.connect();
redisClient.on('ready', () => {
  redisClient.ready = true;
  console.log('Redis is ready');
});

redisClient.on('error', (err) => {
  console.log('redis cluster err', err);
});

redisClient.on('end', () => {
  redisClient.ready = false;
  console.log('Redis is disconnected');
});

module.exports = redisClient;
