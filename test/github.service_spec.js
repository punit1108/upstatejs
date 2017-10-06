var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var requestStub = sinon.stub();
var service = proxyquire('../lib/services/github.service', {
    request: requestStub
});

describe('Github service', function () {

    var callbackSpy;

    beforeEach(function() {
        callbackSpy = sinon.spy();
    });

    afterEach(function() {
        requestStub.reset();
    });

    it('should do GET http request to https://status.github.com/api/status.json', function () {
        service(sinon.stub());
        expect(requestStub.getCall(0).args[0].url).to.equal('https://status.github.com/api/status.json');
        expect(requestStub.getCall(0).args[0].method).to.equal('GET');
        expect(requestStub.getCall(0).args[0].headers['User-Agent']).to.equal('request');
    });

    it('should call provided callback with message "Problem with the connection." in case of error', function(done) {
        var responseBody = 'foo';
        //make fake `request` method call the second argument as a callback with specified arguments
        requestStub.callsArgWithAsync(1, 'error', null, responseBody);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Problem with the connection.');
            expect(callbackSpy.getCall(0).args[0].data).to.equal(responseBody);
            done();
        }, 10);
    });

    it('should call provided callback with message "Could not parse the response." if body contains invalid JSON', function(done) {
        var responseBody = 'foo';
        requestStub.callsArgWithAsync(1, null, null, responseBody);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Could not parse the response.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Minor Problems." if response status is "minor"', function(done) {
        var responseBody = {
            status: 'minor'
        };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Minor Problems');
            done();
        }, 10);
    });

    it('should call provided callback with message "Red Alert - Github may be down." if response status is "major"', function(done) {
        var responseBody = {
            status: 'major'
        };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Red Alert - Github may be down.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Everything operating normally." if response status is "good"', function(done) {
        var responseBody = {
            status: 'good'
        };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Everything operating normally.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Empty response. Try Again." if resonse body is empty', function(done) {
        requestStub.callsArgWithAsync(1, null, null, undefined);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Empty response. Try Again.');
            done();
        }, 10);
    });
});
