const express = require('express');
const app = express();
const ip = "127.0.0.1";
const port = 3000

app.listen(port, ip, function () {
  console.log(`App listening on ${ip}:${port}`);
});

app.use(express.static('static'));