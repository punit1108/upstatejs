'use strict';

var facebook = require("./lib/services/facebook.service.js");
var facebook = require("./lib/services/github.service.js");

module.exports = {
    facebook: facebook,
    github: github
};

// facebook(function(res) {
//         console.log(res);
// });
