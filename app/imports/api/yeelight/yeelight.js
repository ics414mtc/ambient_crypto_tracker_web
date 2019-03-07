import { Meteor } from 'meteor/meteor';

const y = require("yeelight-awesome");

Meteor.methods({
  discover() {
    const discover = new y.Discover({
      port: 1982,
      debug: true
    });

    discover.once("deviceAdded", (device) => {
      const yeelight = new y.Yeelight({
        lightIp: device.host,
        lightPort: device.port
      });

      yeelight.on("connected", () => {
        yeelight.setRGB(new y.Color(123, 99, 65), "smooth", 5000);
      });
      yeelight.connect();
    });

    discover.start();
  }
});
