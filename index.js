'use strict';

var facebook = require("./lib/services/facebook.service.js");

module.exports = function () {
    return {
        facebook: facebook
    };
}

// facebook(function(res) {
//         console.log(res);
// });
