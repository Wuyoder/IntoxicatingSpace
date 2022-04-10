const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  console.log('hihi');
  res.send('hihi');
});

app.get('/rss', (req, res) => {});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
