const db = require('./db_test');

async function truncateDate() {
  const truncateTable = async (table) => {
    await db.query('START TRANSACTION');
    await db.query('SET FOREIGN_KEY_CHECKS = ?', 0);
    await db.query(`TRUNCATE TABLE ${table}`);
    await db.query('SET FOREIGN_KEY_CHECKS = ?', 1);
    await db.query('COMMIT');
    return;
  };
  const tables = [
    'chats',
    'counters',
    'creators_shows',
    'episodes',
    'history_episodes',
    'history_shows',
    'rss',
    'show_links',
    'subcribes',
    'users',
  ];
  for (let table in tables) {
    await truncateTable(table);
  }
  return;
}

//test target
async function insertDate() {}

module.exports = { truncateDate, insertDate };
