import { Meteor } from 'meteor/meteor';

const y = require("yeelight-awesome");
let yeelight = NaN;
let test = 'testing';

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
          yeelight.setRGB(new y.Color(255, 255, 255), "smooth", 5000);
        });
        yeelight.connect();
      });

      discover.start();
      test = 'success';
    }
  },

  toggle_light(light_on) {
      console.log(light_on['light_on']);
      if (!this.isSimulation) {
        console.log(test);
        (light_on['light_on'] ? test = 'light on' : test = 'light off');
        console.log(test);
    }
  }
});
