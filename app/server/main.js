import { Meteor } from 'meteor/meteor';
import { Discover, IDevice, defaultLogger } from "yeelight-awesome";
import bodyParser from 'body-parser';
Picker.middleware(bodyParser());

Meteor.startup(() => {
	const discover = new Discover({ port: 1982,  debug: true });
    var yeelight;
    discover.once("deviceAdded", (device: IDevice) => {
    	yeelight = new y.Yeelight({
            lightIp: device.host,
            lightPort: device.port
        });
        yeelight.on("connected", () => {
            yeelight.setRGB(new y.Color(255, 255, 255), "smooth", 5000);
        });
    });
    discover.start();

    Picker.route('/status', function(params, req, res, next) {
        if (req.body.status == true) {
            yeelight.setBright(100, "smooth", 1000);
        } else {
            yeelight.setBright(0, "smooth", 1000);
        }
        res.end('light changed');
    });
});

Picker.route('/post/:_id', function(params, req, res, next) {
  var post = Posts.findOne(params._id);
  res.end(post.content);
});

var postRoutes = Picker.filter(function(req, res) {
  // you can write any logic you want.
  // but this callback does not run inside a fiber
  // at the end, you must return either true or false
  return req.method == "POST";
});

postRoutes.route('/post/:id', function(params, req, res, next) {
  // ...
});
