'use strict';

var zmq = require('zmq'),
	pmq = require('../index.js'),
	cluster = require('cluster'),
	events = require('events'),
	assert = require('chai').assert,
	HOST = 'tcp://127.0.0.1:6000';

var eventer = new events.EventEmitter();

if (cluster.isMaster) {

	for (var i = 0; i < 2; i++) cluster.fork();

	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died');
	});

	var pubber = zmq.socket('sub');

	pubber.bind(HOST, function(err) {

	});

	eventer.on('fire', function(){
		console.log('about to fire');
		pubber.send('foobar bazbar');
	});
};


describe('pmq', function(){
	describe('method existance', function(){
		it('exists!', function(){
			assert.ok(pmq);
			assert.isObject(pmq);
			assert.isFunction(pmq.connect);
			assert.isFunction(pmq.subscribe);
			assert.isFunction(pmq.unsubscribe);
		});
	});

	describe('pmq#connect()', function(){
		it('connects zmq to its rightful home', function(){
			var r = pmq.connect(HOST);
			assert.isTrue(r);
		});
	});

	describe('pmq#subscribe()', function(){
		it('subscribes pmq to a topic', function(){
			var r = pmq.subscribe('foobar');
			assert.isTrue(r);
		});
	});

	describe('pmq#subscribe()', function(){
		it('subscribes pmq to a topic that it already is', function(){
			var r = pmq.subscribe('foobar');
			assert.isFalse(r);
		});
	});

	describe('pmq#unsubscribe()', function(){
		it('unsubscribes pmq from a topic but has other listeners on the process', function(){
			var r = pmq.unsubscribe('foobar');
			// r is true if we are still listening
			assert.isTrue(r);
		});
	});

	describe('pmq#on("message")', function(){
		it('fires off a message to the subscriber', function(d){
			pmq.on('message', function(d){
				assert.equal('foobar bazbar', d.toString());
				d();
			});
			
			eventer.emit('fire');
		});
	});
});
