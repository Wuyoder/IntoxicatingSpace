require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
app.use(express.static('./public'));
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
