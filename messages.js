'use strict';

/**
 *	The messages class, parse and stringify messages
 *	@class messages
 *	@static
 */
var messages = {};

/** 
 *	Verify that an object message has the right keys
 *	@method _verifyMessage
 *	@param {message} object the object to verify
 *	@return boolean
 *	@api private
 */
var _verifyMessage = function(message) {
	var keys =  ['to', 'from', 'dataType', 'eventType', 'subType', 'data', '_startTime'];	
	var result = true;

	for (var i = 0, len = keys.length; i<len; i++) {
		if (!message.hasOwnProperty(keys[i])) {
			console.error('Message failed to have key '+keys[i]);
			result = false;
		};
	};

	return result;
};

/**
 *	Alias _verifyMessage
 *	@method verifyMessage
 *	@param {message} object the object to verify
 *	@return boolean
 *	@api public
 */
messages.verifyMessage = _verifyMessage;

/**
 *	Parse a string message
 *	@method stringifyMessage
 *	@param {message} string the message to be parsed
 *	@return object
 *	@api public
 */
messages.parseMessage = function(message) {
	if (typeof message !== 'string') return false;
	
	var mess = JSON.parse(message);

	if (typeof mess !== 'object') return false;

	if (!_verifyMessage(mess)) return false;
	
	return mess;
};

/**
 *	Parse an object to string
 *	@method stringifyMessage
 *	@param {message} string the object to parse
 *	@return string
 *	@api public
 */
messages.stringifyMessage = function(message) {
	if (typeof message !== 'object') return false;

	if (!_verifyMessage(message)) return false;

	var mess = JSON.stringify(message);

	if (typeof mess !== 'string') return false;

	return mess;
};

module.exports = messages
