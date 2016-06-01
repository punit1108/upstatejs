"use strict";

var serviceConfig       = require("./../config/services.config.json");

function list () {
    var array = [];

    for (var service in serviceConfig) {
        if (serviceConfig.hasOwnProperty(service)) {
            array.push(service);
        }
    }

    return array;
}

module.exports = list;
