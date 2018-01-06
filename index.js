'use strict';

const express = require("express");
const app = express();
const path = require("path");

const server_port = 8080;
const dirname = __dirname + "/webapp"

// setup every single file necessary
app.use(express.static('webapp'));

app.listen(server_port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${server_port}`);
});
