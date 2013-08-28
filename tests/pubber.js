'use strict';

var zmq = require('zmq'),
	events = require('events'),
	HOST = 'tcp://127.0.0.1:6000';

var eventer = new events.EventEmitter();

var pubber = zmq.socket('pub');

pubber.bind(HOST, function(err) {

});

eventer.on('fire', function(){
	pubber.send('foobar bazbar');
});

module.exports = eventer;
