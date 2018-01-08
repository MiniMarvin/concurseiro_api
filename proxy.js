'use strict';

var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:3001',
    ServerTwo = 'http://localhost:3002',
    ServerThree = 'http://localhost:3002';
 
app.all("/*", function(req, res) {
    // console.log('redirecting to Server1');
    // console.log(req.url);
    // console.log(res);
    if(req.url.indexOf("/api_concurso") > -1) {
      // console.log("here!")
      apiProxy.web(req, res, {target: ServerTwo});
      return;
    }
    apiProxy.web(req, res, {target: serverOne});
});

app.all("/api_concurso", function(req, res) {
    // console.log('redirecting to Server2');
    // console.log(req.url);
    // console.log(res);
    apiProxy.web(req, res, {target: ServerTwo});
});

// app.all("/app2/*", function(req, res) {
//     console.log('redirecting to Server3');
//     apiProxy.web(req, res, {target: ServerThree});
// });

var port = 8080;

app.listen(port, (err) => {
  if(err) {
    console.log("Error in proxy!");
  }
  console.log("Proxy running in port: " + port)
})