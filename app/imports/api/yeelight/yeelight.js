import { Meteor } from 'meteor/meteor';

const y = require("yeelight-awesome");
let yeelight = NaN;
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

        let connect_promise = yeelight.connect();

        connect_promise.then(function(value){
          console.log("Connected to light! ", value);
        });

        connect_promise.catch(function(reason){
          console.log("Something went wrong trying to connect to light! ", reason);
        });
      });

      let promise = discover.start();

      promise.then(function(value){
        console.log("trying to discover light! ", value);
      });

      promise.catch(function(reason){
        console.log("Something went wrong trying to try to discover light! ", reason);
      });
    }
  },

  toggle_light(light_on) {
      console.log(light_on['light_on']);
      let brightness = 0;
      if (!this.isSimulation) {
        (light_on['light_on'] ? brightness = 100 : brightness = 0);
        let set_bright_promise = yeelight.setBright(brightness, "smooth", 1000);
        set_bright_promise.then(function(value){
          console.log("brightness set", value);
        });

        set_bright_promise.catch(function(reason){
          console.log("Something went wrong trying to set brightness! ", reason);
        });
    }
  }
});

