require('dotenv').config();
const { chatRecord } = require('../model/chatroom_model');

const chatHistory = async (req, res) => {
  const history = req.body;
  const recorded = await chatRecord(history.show_id, history.episode_id);
  return res.status(200).send(recorded);
};

module.exports = { chatHistory };
