'use strict';

// var proxy = require('express-http-proxy');
// var proxy_2 = require('express-http-proxy');
// var app = require('express')();
// var port = 8080;

// var proxy_options = {
//   proxyReqPathResolver: function(req) {
//     return new Promise(function (resolve, reject) {
//       setTimeout(function () {   // simulate async
//         var resolvedPathValue = "http://google.com";
//         resolve(resolvedPathValue);
//       }, 200);
//     });
//   }
// } 

// app.use('/', proxy('localhost:8082'));
// // app.use('/api_concurso', proxy_2('localhost:8081/api_concurso'));
// app.use('/api_concurso', proxy('localhost:8082'));

// app.listen(port, function(err) {
//   if (err) {
//     return console.log('something went wrong in proxy', err);
//   }

//   console.log(`proxy is listening on ${port}`);
// });


var express = require('express');
var proxy = require('http-proxy-middleware');
var port = 8082;
 
var app = express();
var options = {
  router: {
      // when request.headers.host == 'dev.localhost:3000', 
      // override target 'http://www.example.org' to 'http://localhost:8000' 
      'dev.localhost:3000' : 'http://localhost:8000'
  }
}
 
app.use('/', proxy({target: 'www.google.com', changeOrigin: true}));
app.listen(port, (err) => {
  if (err) {
    console.log("Something wrong in proxy");
  }
  console.log("proxy running in port " + port);
});