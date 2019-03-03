var express = require('express');
var app = express();
var http = require('http').Server(app);
var ws = require("socket.io")(http);
var cfenv = require('cfenv');
var IoTApp  = require('./application/application.js');

/* Serve the files out of ./public as our main files. */
app.use(express.static(__dirname + '/public'));

/* 
  Get the app environment from Cloud Foundry,
  if you are developing locally (VCAP_SERVICES environment variable not set),
  cfenv will use the file defined by vcapFile instead.
  You can export these local json files from IBM Cloud!
*/
var app_env = cfenv.getAppEnv({vcapFile: 'vcap.json'});
const IOT_PLATFORM = "NAME";

/* Retrieve Cloud Foundry environment variables. */
var credentials = app_env.getServiceCreds(IOT_PLATFORM);
var application = new IoTApp(credentials.org, credentials.apiKey, credentials.apiToken);

/* Application is an event emitter, so we listen for the payload event we defined in application.js! */
application.on('payload', function(data) {
  /* We then broadcast to our clients.  */
  ws.emit('broadcast', JSON.parse(data).number);
});

/* Start server on the specified port and binding host app_env.port */
http.listen(app_env.port || 4096, function() {});
