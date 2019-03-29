import { Meteor } from 'meteor/meteor';

const y = require("yeelight-awesome");

let yeelight = NaN;
let connected = false;
let intervalId = null;

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
        (light_on['light_on'] ? brightness = 100 : brightness = 1);
        let set_bright_promise = yeelight.setBright(brightness, "smooth", 1000);
        set_bright_promise.then(function(value){
          console.log("brightness set", value);
        });

        set_bright_promise.catch(function(reason){
          console.log("Something went wrong trying to set brightness! ", reason);
        });
    }
  },
  request_daily_price() {
    if (!this.isSimulation) {
      const CMC_PRO_API_KEY = "694e5b29-c911-4075-8bf2-05f181df5bb6";
      const API_URL = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD&CMC_PRO_API_KEY=${CMC_PRO_API_KEY}`;
      const result = HTTP.call('GET', API_URL);
      return result.content;
    }
    return null;
  },
  brightness(brightness_percent) {
    if (!this.isSimulation) {
      let set_bright_promise = yeelight.setBright(brightness_percent, "smooth", 1000);
      set_bright_promise.then(function(value){
        console.log(brightness_percent);
        console.log("brightness set", value);
      });
      set_bright_promise.catch(function(err){
        console.log(brightness_percent);
        console.log("Something went wrong trying to set brightness! ", err);
      });
    }
  },
  flicker(flicker_rate) {
    if (!this.isSimulation) {
      let fps = flicker_rate / 10;
      let counter = 0;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(function() {
        counter += fps;
        if (counter > 1) {
          this.toggle_light({"light_on": true});
          this.toggle_light({"light_on": false});
          counter -= 1;
        }
      }, 1000);
    }
  }
});

