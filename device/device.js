var iotf = require("ibmiotf");

class Device {
  constructor(org, token) {
    const device_config = {
      "org": org,
      "domain": "internetofthings.ibmcloud.com",
      "type": "IBM-KTH-Demo",
      "id": "0",
      "auth-method": "token",
      "auth-token": token,
      "use-client-certs": false
    };
    this.device = new iotf.IotfManagedDevice(device_config);
    this._setup();
  }
  
  Push(id, data) {
    this.device.publish(id, 'json', JSON.stringify(data), 0);
  }
  
  _setup() {
    var that = this;
    /* Setting the log level to debug. By default its 'warn' */
    this.device.log.setLevel('debug');
    
    /* Connect it to Watson IoT! */
    this.device.connect();

    /* When your device has connected, setup listeners and callbacks. */
    this.device.on('connect', function(parent){
      console.log("Connected the device.");
      that.device_connected = true;
      
      /* We will skip managed devices for now. */
      //var rc = device_client.manage(4000, false, true);
      
      /* We have no action, however you can setup action listeners. */
      that.device.on('dmAction', function(request){
        console.log('Action : ' + request.Action);
      });
      
      /* If the device disconnects, we do not need to panic. */
      that.device.on('disconnect', function(){
        console.log('Disconnected from IoTF');
        that.device_connected = false;
      });
      
      /* Errors are pretty bad, right? */
      that.device.on('error', function (argument) {
        console.log(argument);
        process.exit(1);
      });
      
      /* Update the device location, long-lat. */
      that.device.updateLocation(59.404568, 17.950141);
    });
  }
  
  IsConnected() {
    return this.device_connected;
  }
}

module.exports = Device;


