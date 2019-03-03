var iotf = require("ibmiotf");
var EventEmitter = require('events');

class Application extends EventEmitter {
  constructor(org, key, token) {
    /* Call super to define this. */
    super();
    
    /* that is used to access this in other scopes below this one. */
    var that = this;
    
    /* This is our config for Watson IoT! */
    const app_config = {
      "org": org,
      "id": "0",
      "domain": "internetofthings.ibmcloud.com",
      "auth-key": key,
      "auth-token": token
    };
    
    /* Application (Your front-end) */
    this.app_client = new iotf.IotfApplication(app_config);
    this.app_client.connect();
    
    /* When your application has connected, setup listeners and callbacks. */
    this.app_client.on("connect", function () {
      console.log("Connected the application.");
      
      /* Subscribe to temperature event on device types of IBM-KTH-Demo and where the device ID is 0. */
      that.app_client.subscribeToDeviceEvents("IBM-KTH", "0", "device_data");
      
      /* On a data recieved, emit event. */
      that.app_client.on("deviceEvent", async function (deviceType, deviceId, eventType, format, payload) {
        //console.log("Device Event from :: " +deviceType + " : " + deviceId + " of event " + eventType + " with payload : " + payload);
        that.emit('payload', payload);
      });
    });
  }
}

module.exports = Application;






