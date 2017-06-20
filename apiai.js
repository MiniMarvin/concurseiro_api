var apiai = require('apiai');
 
var app = apiai("07561c51924046e9a50d8a5eb8a9013e"); // Access token to Concurseiro bot
 
var request = app.textRequest('Olá', {
    sessionId: 'Concurseiro_Com'
});
 
request.on('response', function(response) {
    console.log(response);
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end();