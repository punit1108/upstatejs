'use strict';
var request = require("request");

function facebook (cb) {
    console.log("hi");

    request({
        url: "https://www.facebook.com/platform/api-status/",
        method: "GET",
        headers: {
            "User-Agent": 'request'
        }
    }, function(error, response, body) {
        if(error) {
            return cb({
                status: false,
                message: "Problem with the connection.",
                data: error
            });
        }

        if(body) {
            body = JSON.parse(body);

            if(body.current.health != 1) {
                return cb({
                    status: false,
                    message: body.current.subject
                });
            }

            return cb({
                status: true,
                message: body.current.subject
            });
        }

        return cb({
            status: false,
            message: "Empty response. Try Again."
        });

    });
}

module.exports = facebook;
