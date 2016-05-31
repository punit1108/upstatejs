'use strict';
var serviceName         = "facebook";

var request             = require("request");
var serviceConfig       = require("./../services.config.js");

function facebook (cb) {

    request({
        url: serviceConfig[serviceName],
        method: "GET",
        headers: {
            "User-Agent": 'request'
        }
    }, function(error, response, body) {
        if(error) {
            return cb({
                service: serviceName,
                status: false,
                message: "Problem with the connection.",
                data: error
            });
        }

        if(body) {
            body = JSON.parse(body);

            if(body.current.health != 1) {
                return cb({
                    service: serviceName,
                    status: false,
                    message: body.current.subject
                });
            }

            return cb({
                service: serviceName,
                status: true,
                message: body.current.subject
            });
        }

        return cb({
            service: serviceName,
            status: false,
            message: "Empty response. Try Again."
        });

    });
}

module.exports = facebook;
