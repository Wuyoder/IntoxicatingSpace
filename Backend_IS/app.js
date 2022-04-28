require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const axios = require('axios');

app.get('/test', async (req, res) => {
  let data;
  const result = await axios
    .get('https://intoxicating.space/api/1.0/user/showlist')
    .then((response) => {
      data = response.data;
    });
  res.send(data);
});

//TODO:error handler, try&catch
app.use('/api/1.0/admin', [require('./server/routes/admin_route')]);

app.use('/api/1.0/user', [require('./server/routes/user_route')]);

// TODO:SOCKET.IO

//將啟動的 Server 送給 socket.io 處理
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const { jwtsk } = require('./server/util/jwt');
const db = require('./server/util/mysql');
io.on('connection', (socket) => {
  socket.on('getMessage', async (message) => {
    const who = await jwtsk(message.token);
    let membership = 0;
    let id = 0;
    if (!who.error) {
      membership = 1;
      id = who.id;
    }
    const [new_msg] = await db.query(
      'INSERT INTO chats (show_id, episode_id, membership ,user_id, chat_msg, chat_msg_type, chat_episode_time ) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        message.show_id,
        message.episode_id,
        membership,
        id,
        message.msg,
        message.type,
        message.currentTime,
      ]
    );

    const [recorded] = await db.query(
      'SELECT a.*, b.user_name FROM chats as a  right JOIN users as b ON b.user_id = a.user_id WHERE a.show_id = ? AND a.episode_id = ?  ORDER BY a.chat_episode_time ;',
      [message.show_id, message.episode_id]
    );

    if (!recorded[0]) {
      return socket.broadcast.emit('getMessage', [
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
    let roomId = `${message.show_id}` + `${message.episode_id}`;
    socket.join(roomId);
    io.to(roomId).emit('getMessage', recorded);
  });
});

// Page not found
app.use(function (req, res, next) {
  res.redirect('/');
  //res.send('wrong way...');
});

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
