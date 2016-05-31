'use strict';

var serviceName         = "github";

var request             = require("request");
var serviceConfig       = require("./../config/services.config.json");

var statusMessage       = {
    good: "Everything operating normally.",
    minor: "Minor Problems",
    major: "Red Alert - Github may be down."
};
var result              = {
    service: serviceName,
    status: false
}

function github (cb) {
    request({
        url: serviceConfig[serviceName],
        method: "GET",
        headers: {
            "User-Agent": 'request'
        }
    }, function (error, response, body) {
        if(error) {
            result["message"]    = "Problem with the connection.";
            result["data"]       = body;
            return cb(result);
        }

        if(body) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                result["message"]    = "Could not parse the response.";
                return cb(result);
            }

            if(body.status != "good") {
                result["message"]    = statusMessage[body.status];
                result["data"]       = body;
                return cb(result);
            }

            result["status"]     = true;
            result["message"]    = statusMessage[body.status];
            result['data']       = body;
            return cb(result);
        }

        result["message"]    = "Empty response. Try Again.";
        return cb(result);
    });
}

module.exports = github;
