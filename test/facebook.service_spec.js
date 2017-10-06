var expect = require("chai").expect;
var sinon = require("sinon");
var proxyquire = require("proxyquire");

var requestStub = sinon.stub();
var service = proxyquire("../lib/services/facebook.service", {
    request: requestStub
});

describe("Facebook service", function () {
    var callbackSpy;

    beforeEach(function() {
        callbackSpy = sinon.spy();
    });

    afterEach(function() {
        requestStub.reset();
    });

    it("should do GET http request to https://www.facebook.com/platform/api-status/", function () {
        service(sinon.stub());
        expect(requestStub.getCall(0).args[0].url).to.equal("https://www.facebook.com/platform/api-status/");
        expect(requestStub.getCall(0).args[0].method).to.equal("GET");
        expect(requestStub.getCall(0).args[0].headers["User-Agent"]).to.equal("request");
    });

    it('should call provided callback with message "Problem with the connection." in case of error', function (done) {
        var responseBody = "foo";
        //make fake `request` method call the second argument as a callback with specified arguments
        requestStub.callsArgWithAsync(1, "error", null, responseBody);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal("Problem with the connection.");
            done();
        }, 10);
    });

    it('should call provided callback with message "Could not parse the response." if body contains invalid JSON', function (done) {
        var responseBody = "foo";
        requestStub.callsArgWithAsync(1, null, null, responseBody);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal("Could not parse the response.");
            done();
        }, 10);
    });

    it('should call provided callback with status true if response health is 1', function (done) {
        var responseBody = {
            current: {
                health: 1,
                subject: "Facebook Platform is Healthy",
            },
        };

        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].status).to.be.true;
            done();
        }, 10);
    });

    it('should call provided callback with status false if response health is not 1', function (done) {
        var responseBody = {
            current: {
                health: 0,
                subject: "Oh no! It doesn't work!",
            },
        };

        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].status).to.be.false;
            done();
        }, 10);
    });

    it('should call provided callback with message Facebook gives if health is 1', function (done) {
        var responseBody = {
            current: {
                health: 1,
                subject: "Facebook Platform is Healthy",
            },
        };

        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal(responseBody.current.subject);
            done();
        }, 10);
    });

    it('should call provided callback with message Facebook gives if health is not 1', function (done) {
        var responseBody = {
            current: {
                health: 0,
                subject: "Oh no! It doesn't work!",
            },
        };

        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal(responseBody.current.subject);
            done();
        }, 10);
    });

    it('should call provided callback with message "Empty response. Try Again." if resonse body is empty', function (done) {
        requestStub.callsArgWithAsync(1, null, null, undefined);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal("Empty response. Try Again.");
            done();
        }, 10);
    });
});
