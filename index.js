var facebook    = require("./lib/services/facebook.service.js");
var github      = require("./lib/services/github.service.js");
var heroku      = require("./lib/services/heroku.service.js");

var list        = require("./lib/services/list.service.js");

module.exports = {
    facebook: facebook,
    github: github,
    list: list,
    heroku: heroku,
};
