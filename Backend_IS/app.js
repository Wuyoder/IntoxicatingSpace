require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = (process.env.NODE_ENV === 'test' )
  ? process.env.PORT_TEST
  : process.env.PORT;
const bodyParser = require('body-parser');
const { jwtsk } = require('./server/util/jwt');
const cru = require('./server/model/cru_model');
const chat = require('./server/model/chatroom_model');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/1.0/admin', [require('./server/routes/admin_route')]);
app.use('/api/1.0/user', [require('./server/routes/user_route')]);
// socket.io
io.on('connection', (socket) => {
  socket.on('getMessage', async (message) => {
    const who = await jwtsk(message.token);
    let membership = 0;
    let id = 0;
    if (!who.error) {
      membership = 1;
      id = who.id;
    }
    if (message.msg.indexOf(' ') === -1) {
      const new_msg = await cru.insert('chats', {
        show_id: message.show_id,
        episode_id: message.episode_id,
        membership: membership,
        user_id: id,
        chat_msg: message.msg,
        chat_msg_type: message.type,
        chat_episode_time: message.currentTime,
      });
      const recorded = await chat.chatHistory(
        message.show_id,
        message.episode_id
      );
      let roomId = `${message.show_id}` + `${message.episode_id.split('/')[0]}`;
      socket.join(roomId);
      io.to(roomId).emit('getMessage', recorded);
    }
  });
});
// api url error
app.use(function (req, res, next) {
  res.status(404).send('wrong way.');
});
// error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
