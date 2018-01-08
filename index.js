'use strict';

const express = require("express");
// const app = express();
var app = express();
const path = require("path");

const server_port = 3001;
// const server_port = 80;

// setup every single file necessary
app.use('/', express.static('webapp'));

app.listen(server_port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${server_port}`);
});

module.exports = app;


// const http = require('http');
// const finalhandler = require('finalhandler');
// const serveStatic = require('serve-static');

// const port = 8082;

// var serve = serveStatic("./webapp");

// var server = http.createServer(function(req, res) {
//   var done = finalhandler(req, res);
//   serve(req, res, done);
// });

// server.listen(port);