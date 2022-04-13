require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const axios = require('axios');

app.get('/test', async (req, res) => {
  const result = await axios
    .get('http://localhost:3000/api/1.0/user/showlist')
    .then((response) => {
      const data = response.data;
      var show = '';

      for (i = 0; i < 6; i++) {
        show += `<a href="./show.html"><img class="show_image" src="${data[i].rss_image}">
            <div class="show_name">${data[i].rss_title}</div>
            <div class="show_category">${data[i].rss_category.main}</div></a>`;
      }
    });
  res.send(show);
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
