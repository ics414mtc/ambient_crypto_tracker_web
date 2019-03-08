import { Meteor } from 'meteor/meteor';

const y = require("yeelight-awesome");
let yeelight = NaN;
let promise = NaN;
let connected = false;

Meteor.methods({
  discover() {
    if (!this.isSimulation) {
      const discover = new y.Discover({
        port: 1982,
        debug: true
      });

      discover.once("deviceAdded", (device) => {
        yeelight = new y.Yeelight({
          lightIp: device.host,
          lightPort: device.port
        });

        yeelight.on("connected", () => {
          let lightOnPromise = yeelight.setRGB(new y.Color(255, 255, 255), "smooth", 5000);
          lightOnPromise.then(function(value){
            console.log("Light on! ", value);
          });

          lightOnPromise.catch(function(reason){
              console.log("Something went wrong trying to turn on the light! ", reason);
            });
        });
        yeelight.connect();
      });

      promise = discover.start();

      promise.then(function(value){
        console.log("Connected to light! ", value);
      });

      promise.catch(function(reason){
        console.log("Something went wrong trying to connect to light! ", reason);
      });
    }
  },

  toggle_light(light_on) {
      console.log(light_on['light_on']);
      if (!this.isSimulation) {
        (light_on['light_on'] ? yeelight.setBright(100, "smooth", 1000) : yeelight.setBright(0, "smooth", 1000));
    }
  }
});

