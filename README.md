# submq

Aggregate subscriptions to ZeroMQ accross your process.

`$ npm install pubmq`

## Interface

```
var submq = require('submq');

submq.connect('tcp://127.0.0.1:8080');

// increments subscriber count for `foobar` by 1 or starts subscribing
submq.subscribe('foobar');

submq.on('message', function(mes){
	console.log(typeof mes); // object (buffer)
	console.log(mes.toString());
});

submq.on('error', function(e){
	// handle me
});

// lowers subscriber count for `foobar` by 1 or unsubscribes
submq.unsubscribe('foobar'); 

```

## Running tests

`$ npm test`

## License

(The MIT License)

Copyright (c) 2013 TJ Krusinski &lt;tj@shoflo.tv&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
