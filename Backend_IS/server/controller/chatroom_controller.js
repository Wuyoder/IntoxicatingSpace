const db = require('../util/mysql');
const { jwtwrap } = require('../util/jwt');
const uuid = require('uuid');
const { showunsub } = require('./show_controller');

const chatmsg = async (req, res) => {
  const who = await jwtwrap(req);
  let membership = 1;
  if (who.error) {
    who.id = 0;
    who.name = 'anonymous';
    who.image =
      'https://intoxicating.s3.ap-northeast-1.amazonaws.com/IS_LOGO.png';
    who.role = 2;
    membership = 0;
  }
  const msg = req.body;
  const [new_msg] = await db.query(
    'INSERT INTO chats (show_id, episode_id, membership ,user_id, chat_msg, chat_msg_type, chat_episode_time ) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      msg.show_id,
      msg.episode_id,
      membership,
      who.id,
      msg.chat_msg,
      msg.chat_msg_type,
      msg.chat_episode_time,
    ]
  );

  res.json({ status: 'message recorded' });
};

const chathistory = async (req, res) => {
  const history = req.body;
  const [recorded] = await db.query(
    'SELECT a.*, b.user_name FROM intoxicating.chats as a  right JOIN intoxicating.users as b ON b.user_id = a.user_id WHERE a.show_id = ? AND a.episode_id = ?  ORDER BY a.chat_episode_time',
    [history.show_id, history.episode_id]
  );

  if (!recorded[0]) {
    return res.send([
      {
        chat_id: 1,
        show_id: 'show_id',
        episode_id: 'episode_id',
        membership: 1,
        user_id: 1,
        chat_msg: 'NO MESSSAGE HERE, PLEASE LEAVE YOUR WORDS.',
        chat_msg_type: 'text',
        chat_episode_time: 1,
        time_click: '2046-04-01T00:00:00.000Z',
        user_name: 'IS',
      },
    ]);
  }

  res.send(recorded);
};

module.exports = { chatmsg, chathistory };
