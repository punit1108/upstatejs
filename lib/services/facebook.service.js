'use strict';
var serviceName         = "facebook";

var request             = require("request");
var serviceConfig       = require("./../config/services.config.json");

var result = {
    service: serviceName,
    status: false
}

function facebook (cb) {

    request({
        url: serviceConfig[serviceName],
        method: "GET",
        headers: {
            "User-Agent": 'request'
        }
    }, function(error, response, body) {
        if(error) {
            result["message"]       = "Problem with the connection.";
            result["data"]          = error;
            return cb(result);
        }

        if(body) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                result["message"]    = "Could not parse the response.";
                return cb(result);
            }

            if(body.current.health != 1) {
                result["message"]   = body.current.subject;
                return cb(result);
            }

            result["status"]        = true;
            result["message"]       = body.current.subject;
            return cb(result);
        }

        result["message"]   = "Empty response. Try Again.";
        return cb(result);

    });
}

module.exports = facebook;
