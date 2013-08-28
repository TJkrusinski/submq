'use strict';

var zmq = require('zmq'),
	pmq = require('../index.js'),
	cluster = require('cluster'),
	events = require('events'),
	pubber = require('./pubber.js'),
	assert = require('chai').assert,
	HOST = 'tcp://127.0.0.1:6000';

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
			pmq.on('message', function(b){
				assert.equal('foobar bazbar', b.toString());
				d();
			});
			
			pubber.emit('fire');
		});
	});

	describe('pmq#unsubscribe()', function(){
		it('unsubscribes pmq from a topic', function(){
			var r = pmq.unsubscribe('foobar');
			// r is false if we are done listening
			assert.isFalse(r);
		});
	});
});
