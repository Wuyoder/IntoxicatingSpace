require('dotenv').config();
const chat = require('../model/chatroom_model');

const chathistory = async (req, res) => {
  const history = req.body;
  const recorded = await chat.chatHistory(history.show_id, history.episode_id);
  return res.send(recorded);
};

module.exports = { chathistory };
