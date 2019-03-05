import { Meteor } from 'meteor/meteor';
import { Picker } from 'meteor/meteorhacks:picker';

Meteor.startup(() => {

  // code to run on server at startup
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
