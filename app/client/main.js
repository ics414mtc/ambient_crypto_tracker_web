import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'; 

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
	this.on = new ReactiveVar(true);
});

Template.hello.helpers({
 
});

Template.hello.events({
  'click button'(event, instance) {
  	instance.on.set(!instance.on.curValue);
    console.log('CLICKED!!');
  	HTTP.call('POST', 'http://localhost:3031/status', {
  		data: {
  			status: instance.on.curValue
  		},
  	}, (error, result) => {
  			console.log(error);
  			console.log(result);
  		}
  	);
  },
});
