var iotf = require("ibmiotf");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var cfenv = require('cfenv');

/* serve the files out of ./public as our main files. */
app.use(express.static(__dirname + '/public'));

/* get the app environment from Cloud Foundry. */
var app_env = cfenv.getAppEnv();
/* Retrieve Cloud Foundry environment variables. */
const iot_env = app_env.getService('iotf-service')[0];

console.log(app_env);

/* Watson IoT config */
const device_config = {
  "org": iot_env.credentials.org,
  "domain": "internetofthings.ibmcloud.com",
  "type": "IBM-KTH-Demo",
  "id": "0",
  "auth-method": "token",
  "auth-token": app_env.devtoken,
  "use-client-certs": false
};
const app_config = {
    "org" : iot_env.credentials.org,
    "id" : "0",
    "domain": "internetofthings.ibmcloud.com",
    "auth-key" : iot_env.credentials.apiKey,
    "auth-token" : iot_env.credentials.apiToken
};

/* start server on the specified port and binding host app_env.port */
http.listen(app_env.port || 8080, function() {});

/* Device Emulation (In our case a raspberry pi & sensor) */
var device_client = new iotf.IotfManagedDevice(device_config);

/* Application (Your front-end) */
var app_client = new iotf.IotfApplication(app_config);

/* Setting the log level to trace. By default its 'warn' */
device_client.log.setLevel('debug');

app_client.connect();
device_client.connect();

/* When your application has connected, setup listeners and callbacks. */
app_client.on("connect", function () {
  console.log("Connected the application.");
  
  /* Listen for temperature event on device types of IBM-KTH-Demo and where the device ID is 0. */
  app_client.subscribeToDeviceEvents("IBM-KTH-Demo", "0", "temperature");
  
  /* On a temperature event, insert the new data. */
  app_client.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    //console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
    
    /* Socket.io broadcast of newly arrived data. */
    io.emit('broadcast', JSON.parse(payload).number);
  });
});

/* When your device has connected, setup listeners and callbacks. */
device_client.on('connect', function(){
  console.log("Connected the device.");
  
  /* We will skip managed devices for now. */
	//var rc = device_client.manage(4000, false, true);

  /* Update the device location, long-lat. */
  //device_client.updateLocation(77.598838,12.96829);
  
  setInterval(DemoData, 2000);
});

/* We have no action, however you can setup action listeners. */
device_client.on('dmAction', function(request){
  console.log('Action : '+request.Action);
});

/* Send spoofed data. */
function DemoData() {
   var data = {
      text: "demo_data",
      number: (Math.random() * 10) + 20
   };
  device_client.publish('temperature', 'json', JSON.stringify(data), 0);
}


/* Redundancies. */
device_client.on('disconnect', function(){
  console.log('Disconnected from IoTF');
});

device_client.on('error', function (argument) {
	console.log(argument);
	process.exit(1);
});




