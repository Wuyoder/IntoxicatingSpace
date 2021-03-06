const db = require('../util/db');
const chatRecord = async (show_id, episode_id) => {
  try {
    const [result] = await db.query(
      'SELECT a.*, b.user_name FROM chats as a  right JOIN users as b ON b.user_id = a.user_id WHERE a.show_id = ? AND a.episode_id = ?  ORDER BY a.chat_episode_time ;',
      [show_id, episode_id]
    );
    console.log('result', result);
    if (result.length < 1) {
      return [
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
      ];
    } else {
      return result;
    }
  } catch (err) {
    console.error(err);
    return { error: 'db error ( chatroom_model.chatHistory )' };
  }
};

module.exports = { chatRecord };
