'use strict';

var zmq = require('zmq'),
	events = require('events');

var socket = zmq.socket('sub').connect('tcp://'+process.env.ZMQ_HOST+':5555');

/**
 * 	The SMQ class
 *	@class smq
 *	@static
 */
var smq = Object.create(new events.EventEmitter);

/**
 *	Handle a message
 *	@method messageHandler
 *	@param {message} buffer the message buffer from zmq
 *	@api public
 */
smq.messageHandler = function(message) {

	message = message.toString().split(/^\w*\s{1}/gi);

	var js = message[1];
	var objMessage = messages.parseMessage(js);

	if (!objMessage)
		return console.log('Bad JSON from zmq socket message '+message[0]);

	smq.handleIncomingMessage(objMessage, js);
};

/**
 *	listen for message and dispatch to the right events
 */
socket.on('message', smq.messageHandler);

/**
 *	the id of the server
 *	@property _serverId string
 */
smq._serverId = idgen(20);

if (!smq._serverId) {
	console.log('The server could not be assigned an id');
	process.exit();
};

/**
 *	Get the id of the server
 *	@method serverId
 *	@return {serverId} the id of ther server
 *	@api public
 */
smq.serverId = function(){
	return this._serverId;
};

/**	
 *	Send the message to the right people
 *	At this point the message is sanitary
 *	@method handleMessage
 *	@param {message} object message object
 *	@param {stringMessage} string the message string
 *	@return {undefined}
 *	@api public
 */
smq.handleIncomingMessage = function(message, stringMessage){
	smq.emit('message', message, stringMessage);
};

/**
 *	Handle outgoing message, send it the socket
 *	@method handleOutgoingMessage
 *	@param {message} object the message to send
 */
smq.handleOutgoingMessage = function(message){
	
	if (!messages.verifyMessage(message))
		return console.log('FATAL: bad message format');

	message.serverId = this.serverId();

	var stringMessage = messages.stringifyMessage(message);	

	this.send(message.dataType, message);
};

/**
 * 	Holds and retains the subscriptions and callbacks
 *	@property subscriptions
 */
smq.subscriptions = {};

/**
 *	subscribe the socket to the type and id
 *	If there is more than 1 listeners just increment the count
 *	don't resubscribe the socket
 *	@param {type} string type of data to sub to
 *	@param {id} string id of data to sub to
 *	@return {boolean} returns true or false
 *	@api public
 */
smq.subscribe = function(type, id){
	if (!id) return false;

	if (this.subscriptions[id]) {
		this.subscriptions[id]++;
		return false;
	};

	this.subscriptions[id] = 1;

	socket.subscribe(id);

	return true;
};

/**
 *	unsubscribe the socket to the type and id
 *	If there are more than 1 listeners just decrement the count
 *	don't unsubscribe the socket
 *	@param {type} string type of data to unsub to
 *	@param {id} string id of data to unsub to
 *	@return {boolean} returns true or false
 *	@api public
 */
smq.unsubscribe = function(type, id){
	if (!this.subscriptions[id]) return false;
	
	this.subscriptions[id]--;
	
	if (this.subscriptions[id] === 0) {
		delete this.subscriptions[id];
		socket.unsubscribe(id);
	};

	return true;
};

/**
 *	send a message to the socket
 *	@method send
 *	@param {message} object message object to send to pub sub
 */
smq.send = function(url, message){

	var stringMessage = messages.stringifyMessage(message);

	if (!stringMessage)
		return console.log('invalid message to send to the socket system');

	// Do not send `nobroadcast` messages
	if (message.dataType === 'nobroadcast') return;

	var request = http.request({
		hostname: process.env.ZMQ_HOST,
		port: '5556',
		path: '/'+url,
		method: 'POST',
	}, function(res){
		var response = '';
		res.setEncoding('utf8');
		res.on('data', function(d){
			response += d;
		});
		res.on('end', function(){
		
		});
	});	

	request.on('error', function(e){
		console.log('FATAL: '+e+' for ZMQ server request');
	});

	request.write(stringMessage);
	request.end();
};

module.exports = smq;
