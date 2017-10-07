var serviceName         = "heroku";

var request             = require("request");
var serviceConfig       = require("./../config/services.config.json");

function heroku (cb) {
    var result = {
        service: serviceName,
        status: false
    }

    request({
        url: serviceConfig[serviceName],
        method: "GET",
        headers: {
            "User-Agent": 'request'
        }
    }, function (error, response, body) {
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

            if(body.status.Production != "green" && body.status.Development != "green") {
                result['message']     = "Production and Development unhealthy.";
                result['data']        = body.issues;
                return cb(result);
            }

            if(body.status.Production != "green") {
                result['message']     = "Production unhealthy.";
                result['data']        = body.issues;
                return cb(result);
            }

            if(body.status.Development != "green") {
                result['message']     = "Development unhealthy.";
                result['data']        = body.issues;
                return cb(result);
            }

            result["status"]          = true;
            result["message"]         = "Service healthy.";
            return cb(result);
        }

        result["message"]   = "Empty response. Try Again.";
        return cb(result);
    });
}

module.exports = heroku;
