'use strict';

var zmq = require('zmq'),
	events = require('events'),
	subs = {};

var socket = zmq.socket('sub');

/**
 *	Interface
 */
var pmq = Object.create(new events.EventEmitter);

/**
 *	Reference to subscriptions
 *	@property subscriptions
 */
pmq.subscriptions = {};

/**
 *	@method connect
 *	@param {String} addr
 *	@return pmq
 */
pmq.connect = function(addr) {
	socket.connect(addr);
	return true;
};

/**
 *	@method subscribe
 *	@param {String} topic
 *	@return 
 */
pmq.subscribe = function(topic) {
	if (this.subscriptions[topic]) {
		this.subscriptions[topic]++;
		return false;
	};

	this.subscriptions[topic] = 1;

	socket.subscribe(topic);

	return true;
};

/**
 *	@method unsubscribe
 *	@param {String} topic
 */
pmq.unsubscribe = function(topic) {
	if (!this.subscriptions[topic]) return false;
	
	this.subscriptions[topic]--;
	
	if (this.subscriptions[topic] === 0) {
		delete this.subscriptions[topic];
		socket.unsubscribe(topic);
		return false;
	};

	return true;
};

module.exports = pmq;

/**
 *	Relay events back
 */
socket.on('error', function(d){
	pmq.emit('error', d);
});

socket.on('message', function(d){
	pmq.emit('message', d);
});

socket.on('disconnect', function(d){
	pmq.emit('diconnect', d);
});
