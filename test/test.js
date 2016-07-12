var expect = require('chai').expect;
var test = require('../index.js');

describe("should return the list of services.", function () {

    it("the list should be of type array", function () {
        var list = test.list();

        expect(list).to.be.instanceof(Array);
    });
});
