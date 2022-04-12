require('dotenv').config();
const express = require('express');
const xml = require('xml');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const axios = require('axios');

//TODO:error handler, try&catch

app.use('/api/1.0/admin', [require('./server/routes/admin_route')]);

app.get('/testximalaya', async (req, res) => {
  let data;
  await axios
    .get('https://www.ximalaya.com/album/29062634.xml')
    .then(function (response) {
      data = response.data;
    });

  res.header('Content-Type', 'application/xml').send(data);
});

app.get('/rss', (req, res) => {
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:psc="https://podlove.org/simple-chapters/" xmlns:kkbox="https://podcast.kkbox.com/">
    <channel>
        <item>
        </item>
            </channel>
</rss>`;

  res.header('Content-Type', 'application/xml').send(rss);
});

// Page not found
app.use(function (req, res, next) {
  res.sendStatus(404);
});

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
