# downy

Get status of popular services on the go.

Services supported :
  - Facebook
  - Github

###Quick Setup

    npm install downy

you can also install without worrying about adding to package.json

    npm install downy --save

include the library by doing

    var downy = require("downy")

and you are ready to use downy

###Usage

The status queries for the services can be called by

	downy.facebook()
    downy.github()

both of which provide a callback function, which is called after the process of fetching the status is completed.

you can use the above functions like below

	downy.facebook(function (response){
		//PLAY WITH RESPONSE
	});

the response has the following keys

- service - `string` - name of the service
- status - `boolean`  - true if the service is healthy else false
- message - `string`  - human readable string to interpret the situation of service.
- data - `Object` - may or may not exist. Response object.

A list of services available can be found by

    downy.list()

which return an `array` with name of the services available.
