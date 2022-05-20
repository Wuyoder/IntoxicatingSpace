const { db_test } = require('./db_test');
const { fake_chatHistory } = require('./fake_data');

async function truncateDate() {
  console.log('table truncate start!!!!');
  const truncateTable = async (table) => {
    await db_test.query('START TRANSACTION');
    await db_test.query('SET FOREIGN_KEY_CHECKS = ?', 0);
    await db_test.query(`TRUNCATE TABLE ${table}`);
    await db_test.query('SET FOREIGN_KEY_CHECKS = ?', 1);
    await db_test.query('COMMIT');
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

  tables.map((x) => truncateTable(x));
  return;
}

async function insertFakeChatHistory() {
  console.log('start insertFakeData');
  await db_test.query(
    'INSERT INTO chats ( show_id, episode_id, membership, user_id, chat_msg, chat_msg_type, chat_episode_time ) VALUES ?',
    [fake_chatHistory.map((x) => Object.values(x))]
  );
}

//test target
async function insertFakeDate() {
  await db_test.query('START TRANSACTION');
  await insertFakeChatHistory();
  await db_test.query('COMMIT');
}

module.exports = { truncateDate, insertFakeDate };
