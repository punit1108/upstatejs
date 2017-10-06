# upstatejs

Get status of popular services on the go.

[![NPM](https://nodei.co/npm/upstatejs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/upstatejs/)

[![CircleCI](https://circleci.com/gh/punit1108/upstatejs.svg?style=svg&circle-token=36df2a03348c641b59526884a6fb868f7442f0d1)](https://circleci.com/gh/punit1108/upstatejs/tree/master)
    [![Build Status](https://travis-ci.org/punit1108/upstatejs.svg?branch=master)](https://travis-ci.org/punit1108/upstatejs)

Services supported :
  - Facebook
  - Github
  - Heroku

### Quick Setup

    npm install upstatejs

you can also install without worrying about adding to package.json

    npm install upstatejs --save

include the library by doing

    var upstate = require("upstatejs")

and you are ready to use upstate

### Usage

The status queries for the services can be called by

	upstate.facebook()
    upstate.github()
    upstate.heroku()

both of which provide a callback function, which is called after the process of fetching the status is completed.

you can use the above functions like below

	upstate.facebook(function (response){
		//PLAY WITH RESPONSE
	});

the response has the following keys

- service - `string` - name of the service
- status - `boolean`  - true if the service is healthy else false
- message - `string`  - human readable string to interpret the situation of service.
- data - `Object` - may or may not exist. Response object.

A list of services available can be found by

    upstate.list()

which return an `array` with name of the services available.
